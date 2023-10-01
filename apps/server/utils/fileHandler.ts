import fs from "fs";
import path, { resolve } from "path";

const code = ["driver", "solution", "result"]
const files = {
	"java": ["Driver.java", "Solution.java", "Result.java"],
	"python": ["driver.py", "solution.py", "result.py"],
	"javascript": ["driver.js", "solution.js", "result.js"]
}
const containers = {
	java: {
		image: "openjdk:11",
	},
	python: {
		image: "python:3.9-alpine",
		run: "python driver.py",
	},
	javascript: {
		image: "node:16.20-alpine",
		run: "node driver.js",
	},
};

export function createDriverFiles(driverCode, result: string, language: string, dirPath: string, slug: string, action: string) {
	if (action === "submit") {
		const files = ['output.txt', 'testcase.txt'];
		for (let file of files) {
			try {
				fs.copyFileSync(path.join("uploads", slug, file), path.join(dirPath, file));
			} catch (err) {
				console.log(err)
				console.log("Files couldn't be copied!");
			}

		}
	}
	// Write Driver and Solution files from driverCode
	for (let i = 0; i < 2; i++) {
		let filePath = path.join(dirPath, files[language][i]);
		let content: string = driverCode[language][code[i]];
		if (!content)
			content = `${code[i]} - ${language}`
		try {
			fs.writeFileSync(filePath, content);
		} catch (err) {
			console.log(`Error writing ${files[language][i]} file`, err);
		}
	}
	// Write result files from result
	let filePath = path.join(dirPath, files[language][2]);

	if (!result)
		result = `${code[2]} - ${language}`
	try {
		fs.writeFileSync(filePath, result);
	} catch (err) {
		console.log(`Error writing ${files[language][2]} file`, err);
	}

	// 	// Write Dockerfile
	// 	// COPY ${ resolve(dirPath).replace(/\\/g, '/') } /app
	// 	let dockerfileContent = `FROM ${containers[language].image}

	// WORKDIR /app

	// COPY . /app

	// ENV ACTION=${action}

	// RUN ls

	// `
	// 	if (language === "java")
	// 		dockerfileContent += `RUN javac Result.java Solution.java Driver.java && \
	// 	java Driver`
	// 	else dockerfileContent += `RUN ${containers[language].run}`

	// 	fs.writeFileSync(path.join(dirPath, "Dockerfile"), dockerfileContent)
}