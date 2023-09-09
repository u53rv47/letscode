"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("../middleware/auth"));
const db_1 = require("../db");
function driverCodeFiles(driverCode, slug) {
    const langs = ["java", "python", "javascript"];
    const code = ["driver", "solution", "result"];
    const files = {
        "java": ["Driver.java", "Solution.java", "Result.java"],
        "python": ["driver.py", "solution.py", "result.py"],
        "javascript": ["driver.js", "solution.js", "result.js"]
    };
    for (let lang of langs) {
        let langPath = path_1.default.join("uploads", slug, lang);
        if (!fs_1.default.existsSync(langPath))
            fs_1.default.mkdirSync(langPath, { recursive: true });
        for (let i = 0; i < 3; i++) {
            let filePath = path_1.default.join(langPath, files[lang][i]);
            if (!driverCode[lang][code[i]])
                driverCode[lang][code[i]] = `${code[i]} for ${lang}`;
            fs_1.default.writeFile(filePath, driverCode[lang][code[i]], (err) => {
                if (err)
                    console.log(`Error writing ${files[lang][i]} file`, err);
                driverCode[lang][code[i]] = filePath;
            });
        }
    }
    return driverCode;
}
const router = express_1.default.Router();
router.get("/:slug", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const problem = yield db_1.Problem.findOne({ slug });
        const result = {};
        result['java'] = problem.driverCode.java.result;
        result['python'] = problem.driverCode.python.result;
        result['javascript'] = problem.driverCode.javascript.result;
        const solution = { title: problem.title, description: problem.description, testcase: problem.testcase, inputs: problem.inputs, result };
        res.status(200).json(solution);
    }
    catch (err) {
        res.status(404).send({ message: "Not found", error: err });
    }
}));
exports.default = router;
