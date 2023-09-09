import express, { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";
import authenticateJwt from "../middleware/auth";
import { Problem } from "../db"

function driverCodeFiles(driverCode, slug: string) {
	const langs = ["java", "python", "javascript"]
	const code = ["driver", "solution", "result"]
	const files = {
		"java": ["Driver.java", "Solution.java", "Result.java"],
		"python": ["driver.py", "solution.py", "result.py"],
		"javascript": ["driver.js", "solution.js", "result.js"]
	}

	for (let lang of langs) {
		let langPath = path.join("uploads", slug, lang);

		if (!fs.existsSync(langPath))
			fs.mkdirSync(langPath, { recursive: true });

		for (let i = 0; i < 3; i++) {
			let filePath = path.join(langPath, files[lang][i]);

			if (!driverCode[lang][code[i]])
				driverCode[lang][code[i]] = `${code[i]} for ${lang}`

			fs.writeFile(filePath, driverCode[lang][code[i]], (err) => {
				if (err)
					console.log(`Error writing ${files[lang][i]} file`, err);
				driverCode[lang][code[i]] = filePath;
			})
		}
	}

	return driverCode;
}


const router = express.Router();

router.get("/:slug", authenticateJwt, async (req: Request, res: Response) => {
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

export default router;