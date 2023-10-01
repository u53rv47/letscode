import express, { Express, Request, Response } from "express";
import fs from "fs-extra";
import path from "path";
import authenticateJwt from "../middleware/auth";
import { Problem, User } from "../db"
import { createDriverFiles } from "../utils/fileHandler";
import { consoleOutput, error, runContainer } from "../utils/codeRunner";

const router = express.Router();

router.get("/:slug", async (req: Request, res: Response) => {
	const slug = req.params.slug;
	try {
		const problem = await Problem.findOne({ slug });

		const result = {}
		result['java'] = problem.driverCode.java.result;
		result['python'] = problem.driverCode.python.result;
		result['javascript'] = problem.driverCode.javascript.result;

		const solution = { title: problem.title, description: problem.description, testcase: problem.testcase, inputs: problem.inputs, result };

		res.status(200).json(solution);
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});


router.post("/:slug", authenticateJwt, async (req: Request, res: Response) => {
	const slug = req.params.slug;
	const userId = req.user.userId;
	const { language, result, testcase } = req.body.data;
	const action = req.body.action;

	try {
		const problem = await Problem.findOne({ slug }).select(["id", "driverCode"])

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

		const dirPath = path.join("uploads", Date.now().toString())
		console.log("\n\ndockerPath: ", dirPath);
		fs.mkdirSync(dirPath, { recursive: true });
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
				res.status(400).send({ message: "An error occured while running the program.", result: "error", error: consoleOutput });
			} else {
				const filePath = path.join(dirPath, "final_output.txt");
				try {
					const output = fs.readFileSync(filePath).toString().split("\n");
					if (output[0] === "failed") {
						let temp = consoleOutput.trim().split("\n");
						const testcases = parseInt(output[2].split("/")[1]);

						const step = temp.length / testcases;
						let testOutput: string[] = [];
						for (let i = 0; i < temp.length; i += step) {
							testOutput.push(temp.slice(i, i + step).join("\n"));
						}

						res.status(400).send({ result: "failed", failed_testcases: output[1], output: output[2], consoleOutput: testOutput })
					} else if (output[0] === "passed") {
						// Add this problem to solved if solved successfully
						if (action === "submit") {
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
						}
						res.status(200).send({ result: "passed", output: output[1] })
					} else {
						// Send error as response
						let err = output[1];
						if (output.length > 2) {
							for (let i = 2; i < output.length; i++)
								err += ("\n" + output[i]);
						}
						res.status(400).send({ message: "Internal Error.", result: "Internal Error", error: err, consoleOutput })
					}
				} catch (e) {
					res.status(400).send({ message: "An error occured while reading oputput file.", result: "error", error: e, consoleOutput });
				}
			}

			// fs.remove(dirPath)
			// 	.then(() => {
			// 		console.log(`Directory ${dirPath} has been removed.`);
			// 	})
			// 	.catch((err) => {
			// 		console.error(`Error removing directory ${dirPath}: ${err}`);
			// 	});
		});
	} catch (err) {
		console.log(err)
		res.status(404).send({ message: "Something went wrong", error: err });
	}

})

export default router;