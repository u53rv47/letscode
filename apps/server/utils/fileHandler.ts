import fs from "fs-extra";
import path from "path";
import { languages, code, files } from "common";

export function writeDriverFilesSync(slug, driverCode): void {
	for (let i = 0; i < 3; i++) {
		let dirPath = path.join("uploads", slug, "driverCode", languages[i]);
		fs.mkdirSync(dirPath, { recursive: true });
		for (let j = 0; j < 3; j++) {
			let filePath = path.join(dirPath, files[languages[i]][j]);
			let data = driverCode[languages[i]][code[j]];
			fs.writeFileSync(filePath, data);
		}
	}
}
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

export function removeDirSync(dirPath: string) {
	fs.remove(dirPath)
		.then(() => {
			console.log(`Directory ${dirPath} has been removed.`);
		})
		.catch((err) => {
			console.error(`Error removing directory ${dirPath}: ${err}`);
		});
}