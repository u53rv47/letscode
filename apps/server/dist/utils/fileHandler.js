"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDirSync = exports.createDriverFiles = exports.writeDriverFilesSync = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const common_1 = require("common");
function writeDriverFilesSync(slug, driverCode) {
    for (let i = 0; i < 3; i++) {
        let dirPath = path_1.default.join("uploads", slug, "driverCode", common_1.languages[i]);
        fs_extra_1.default.mkdirSync(dirPath, { recursive: true });
        for (let j = 0; j < 3; j++) {
            let filePath = path_1.default.join(dirPath, common_1.files[common_1.languages[i]][j]);
            let data = driverCode[common_1.languages[i]][common_1.code[j]];
            fs_extra_1.default.writeFileSync(filePath, data);
        }
    }
}
exports.writeDriverFilesSync = writeDriverFilesSync;
function createDriverFiles(driverCode, result, language, dirPath, slug, action) {
    if (action === "submit") {
        const files = ['output.txt', 'testcase.txt'];
        for (let file of files) {
            try {
                fs_extra_1.default.copyFileSync(path_1.default.join("uploads", slug, file), path_1.default.join(dirPath, file));
            }
            catch (err) {
                console.log(err);
                console.log("Files couldn't be copied!");
            }
        }
    }
    for (let i = 0; i < 2; i++) {
        let filePath = path_1.default.join(dirPath, common_1.files[language][i]);
        let content = driverCode[language][common_1.code[i]];
        if (!content)
            content = `${common_1.code[i]} - ${language}`;
        try {
            fs_extra_1.default.writeFileSync(filePath, content);
        }
        catch (err) {
            console.log(`Error writing ${common_1.files[language][i]} file`, err);
        }
    }
    let filePath = path_1.default.join(dirPath, common_1.files[language][2]);
    if (!result)
        result = `${common_1.code[2]} - ${language}`;
    try {
        fs_extra_1.default.writeFileSync(filePath, result);
    }
    catch (err) {
        console.log(`Error writing ${common_1.files[language][2]} file`, err);
    }
}
exports.createDriverFiles = createDriverFiles;
function removeDirSync(dirPath) {
    fs_extra_1.default.remove(dirPath)
        .then(() => {
        console.log(`Directory ${dirPath} has been removed.`);
    })
        .catch((err) => {
        console.error(`Error removing directory ${dirPath}: ${err}`);
    });
}
exports.removeDirSync = removeDirSync;
