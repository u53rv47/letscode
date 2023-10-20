import path from "path";
import fs from "fs-extra";
import express, { Request, Response } from "express";
import authenticateJwt from "../middleware/auth";
import { Problem, Solution, User } from "../db";
import { languages } from "common";
import { createDriverFiles, removeDirSync } from "../utils/fileHandler";
import { consoleOutput, error, runContainer } from "../utils/codeRunner";

const router = express.Router();

router.get("/:slug", async (req: Request, res: Response) => {
	const slug = req.params.slug;
	try {
		const problem = await Problem.findOne({ slug });
		let solution = await Solution.findOne({ problemId: problem._id });

		const result = {}
		languages.forEach((val, i, arr) => {
			if (solution.language !== val)
				result[val] = problem.driverCode[val].result;
			else result[val] = solution.solution;
		});

		res.status(200).json({ title: problem.title, description: problem.description, testcase: problem.testcase, inputs: problem.inputs, result });
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});


router.post("/:slug", authenticateJwt, async (req: Request, res: Response) => {
	const slug = req.params.slug;
	const userId = req.user.userId;
	const { language, result, testcase } = req.body.data;
	const action = req.body.action;

	const dirPath = path.join("uploads", Date.now().toString())
	fs.mkdirSync(dirPath, { recursive: true });
	console.log("\n\ndockerPath: ", dirPath);
	try {
		const problem = await Problem.findOne({ slug }).select(["id", "driverCode"]);

		const options = { upsert: true, new: true, setDefaultsOnInsert: true };
		await Solution.findOneAndUpdate({ problemId: problem._id, userId }, { language, solution: result }, options);

		// Add this problem to attempted if it's a submit request
		if (action === "submit") {
			const attempted = (await User.findById(userId).select("attempted")).attempted;
			let flag = true;
			for (let i = 0; i < attempted.length; i++) {
				if (attempted[i] === problem._id) {
					flag = false;
					break;
				}
			}
			if (flag)
				attempted.push(problem._id);
			await User.findByIdAndUpdate(userId, { attempted });
		}

		if (action === 'run') {
			// Use sample testcase
			fs.writeFile(path.join(dirPath, 'testcase.txt'), testcase, (err: Error) => {
				if (err)
					console.log(`Error writing testcase.txt file`, err);
			})
		}

		createDriverFiles(problem.driverCode, result, language, dirPath, slug, action);
		runContainer(dirPath, language, action, async () => {
			if (error) {
				res.status(200).send({ result: "error", output: { message: "An error occured while running the program.", error: consoleOutput } });
			} else {
				const filePath = path.join(dirPath, "final_output.txt");
				try {
					const output = fs.readFileSync(filePath).toString().split("\n");
					if (output[0] === "failed") {
						if (action === "run") {
							// Transform console output
							let temp = consoleOutput.trim().split("\n");
							const testcases = parseInt(output[1].split("/")[1]);
							const step = temp.length / testcases;
							let testOutput: string[] = [];
							for (let i = 0; i < temp.length; i += step) {
								testOutput.push(temp.slice(i, i + step).join("\n"));
							}
							if (testOutput[0] === "")
								testOutput = []
							const result = { result: "failed", output: { output: output[1], actual_output: output[2], expected_output: output[3], failed_testcases: output[4], console_output: JSON.stringify(testOutput) } }
							res.status(200).send({ ...result });
						} else {
							// Transform console output
							let temp = consoleOutput.trim().split("\n");
							const testcases = parseInt(output[1].split("/")[1]);
							const failed = JSON.parse(output[4])[0] - 1;
							const step = temp.length / testcases;
							let testOutput: string[] = [];

							testOutput.push(temp.slice(failed, failed + step).join("\n"));
							if (testOutput[0] === "")
								testOutput = []

							const result = { result: "failed", output: { output: output[1], actual_output: output[2], expected_output: output[3], input: output.slice(5).join("\n"), console_output: JSON.stringify(testOutput) } }

							res.status(200).send({ ...result });
						}
					} else if (output[0] === "passed") {
						if (action === "run") {
							// Transform console output
							let temp = consoleOutput.trim().split("\n");
							const testcases = parseInt(output[1].split("/")[1]);
							const step = temp.length / testcases;
							let testOutput: string[] = [];
							for (let i = 0; i < temp.length; i += step) {
								testOutput.push(temp.slice(i, i + step).join("\n"));
							}
							if (testOutput[0] === "")
								testOutput = []

							res.status(200).send({ result: "passed", output: { output: output[1], actual_output: output[2], expected_output: output[3], console_output: JSON.stringify(testOutput) } });
						} else {
							// Add this problem to solved if solved successfully
							let flag = true;
							const solved = (await User.findById(userId).select("solved")).solved
							for (let i = 0; i < solved.length; i++) {
								if (solved[i] === problem._id) {
									flag = false;
									break
								}
							}
							if (flag)
								solved.push(problem._id);
							await User.findByIdAndUpdate(userId, { solved });
							res.status(200).send({ result: "passed", output: { output: output[1] } });
						}
					} else {
						// Send error as response
						let err = output[1];
						if (output.length > 2) {
							for (let i = 2; i < output.length; i++)
								err += ("\n" + output[i]);
						}
						res.status(200).send({ result: "Internal Error", output: { error: err, console_output: consoleOutput } });
					}

				} catch (e) {
					removeDirSync(dirPath);
					res.status(200).send({ result: "error", output: { message: "An error occured while reading oputput file.", error: e, console_output: consoleOutput } });
				}
			}
			removeDirSync(dirPath);
		});


	} catch (err) {
		removeDirSync(dirPath);

		console.log(err);
		res.status(200).send({ result: "error", output: { message: "Something went wrong", error: err } });
	}
});

export default router;