"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const common_1 = require("common");
function updateDrivers() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const language = common_1.languages[i];
            const filePath = path_1.default.join("drivers", common_1.languages[i], common_1.files[language][j]);
            common_1.driverCode[language][common_1.code[j]] = fs_extra_1.default.readFileSync(filePath).toString("utf8");
        }
    }
    ;
}
exports.default = updateDrivers;
