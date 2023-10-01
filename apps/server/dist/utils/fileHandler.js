"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDriverFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const code = ["driver", "solution", "result"];
const files = {
    "java": ["Driver.java", "Solution.java", "Result.java"],
    "python": ["driver.py", "solution.py", "result.py"],
    "javascript": ["driver.js", "solution.js", "result.js"]
};
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
function createDriverFiles(driverCode, result, language, dirPath, slug, action) {
    if (action === "submit") {
        const files = ['output.txt', 'testcase.txt'];
        for (let file of files) {
            try {
                fs_1.default.copyFileSync(path_1.default.join("uploads", slug, file), path_1.default.join(dirPath, file));
            }
            catch (err) {
                console.log(err);
                console.log("Files couldn't be copied!");
            }
        }
    }
    for (let i = 0; i < 2; i++) {
        let filePath = path_1.default.join(dirPath, files[language][i]);
        let content = driverCode[language][code[i]];
        if (!content)
            content = `${code[i]} - ${language}`;
        try {
            fs_1.default.writeFileSync(filePath, content);
        }
        catch (err) {
            console.log(`Error writing ${files[language][i]} file`, err);
        }
    }
    let filePath = path_1.default.join(dirPath, files[language][2]);
    if (!result)
        result = `${code[2]} - ${language}`;
    try {
        fs_1.default.writeFileSync(filePath, result);
    }
    catch (err) {
        console.log(`Error writing ${files[language][2]} file`, err);
    }
}
exports.createDriverFiles = createDriverFiles;
