import fs from "fs-extra";
import path from "path";
import { languages, code, files, LanguageCode, driverCode } from "common";

export default function updateDrivers(): void {
	for (let i = 0; i < languages.length; i++) {
		for (let j = 0; j < code.length; j++) {
			const language = languages[i];
			const filePath = path.join("drivers", languages[i], files[language as keyof typeof files][j]);
			// console.log("FilePath: " + filePath);
			driverCode[language as keyof typeof driverCode][code[j] as keyof LanguageCode] = fs.readFileSync(filePath).toString("utf8");
		}
	};
}