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
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("../middleware/auth"));
const db_1 = require("../db");
const fileHandler_1 = require("../utils/fileHandler");
const codeRunner_1 = require("../utils/codeRunner");
const router = express_1.default.Router();
router.get("/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.post("/:slug", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    const userId = req.user.userId;
    const { language, result, testcase } = req.body.data;
    const action = req.body.action;
    try {
        const problem = yield db_1.Problem.findOne({ slug }).select(["id", "driverCode"]);
        if (action === "submit") {
            const attempted = (yield db_1.User.findById(userId).select("attempted")).attempted;
            let flag = true;
            for (let i = 0; i < attempted.length; i++) {
                if (attempted[i] === problem._id) {
                    flag = false;
                    break;
                }
            }
            if (flag)
                attempted.push(problem._id);
            yield db_1.User.findByIdAndUpdate(userId, { attempted });
        }
        const dirPath = path_1.default.join("uploads", Date.now().toString());
        console.log("\n\ndockerPath: ", dirPath);
        fs_extra_1.default.mkdirSync(dirPath, { recursive: true });
        if (action === 'run') {
            fs_extra_1.default.writeFile(path_1.default.join(dirPath, 'testcase.txt'), testcase, (err) => {
                if (err)
                    console.log(`Error writing testcase.txt file`, err);
            });
        }
        (0, fileHandler_1.createDriverFiles)(problem.driverCode, result, language, dirPath, slug, action);
        (0, codeRunner_1.runContainer)(dirPath, language, action, () => __awaiter(void 0, void 0, void 0, function* () {
            if (codeRunner_1.error) {
                res.status(400).send({ message: "An error occured while running the program.", result: "error", error: codeRunner_1.consoleOutput });
            }
            else {
                const filePath = path_1.default.join(dirPath, "final_output.txt");
                try {
                    const output = fs_extra_1.default.readFileSync(filePath).toString().split("\n");
                    if (output[0] === "failed") {
                        let temp = codeRunner_1.consoleOutput.trim().split("\n");
                        const testcases = parseInt(output[2].split("/")[1]);
                        const step = temp.length / testcases;
                        let testOutput = [];
                        for (let i = 0; i < temp.length; i += step) {
                            testOutput.push(temp.slice(i, i + step).join("\n"));
                        }
                        res.status(400).send({ result: "failed", failed_testcases: output[1], output: output[2], consoleOutput: testOutput });
                    }
                    else if (output[0] === "passed") {
                        if (action === "submit") {
                            let flag = true;
                            const solved = (yield db_1.User.findById(userId).select("solved")).solved;
                            for (let i = 0; i < solved.length; i++) {
                                if (solved[i] === problem._id) {
                                    flag = false;
                                    break;
                                }
                            }
                            if (flag)
                                solved.push(problem._id);
                            yield db_1.User.findByIdAndUpdate(userId, { solved });
                        }
                        res.status(200).send({ result: "passed", output: output[1] });
                    }
                    else {
                        let err = output[1];
                        if (output.length > 2) {
                            for (let i = 2; i < output.length; i++)
                                err += ("\n" + output[i]);
                        }
                        res.status(400).send({ message: "Internal Error.", result: "Internal Error", error: err, consoleOutput: codeRunner_1.consoleOutput });
                    }
                }
                catch (e) {
                    res.status(400).send({ message: "An error occured while reading oputput file.", result: "error", error: e, consoleOutput: codeRunner_1.consoleOutput });
                }
            }
        }));
    }
    catch (err) {
        console.log(err);
        res.status(404).send({ message: "Something went wrong", error: err });
    }
}));
exports.default = router;
