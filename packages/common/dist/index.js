"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialProblem = exports.initialInputs = exports.initialDesc = exports.driverCode = exports.files = exports.code = exports.languages = exports.userInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = require("zod");
exports.signupInput = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Username is required",
        invalid_type_error: 'Username must be of type "String"',
    }),
    username: zod_1.z.string({
        required_error: "Username is required",
        invalid_type_error: 'Username must be of type "String"',
    }).min(6),
    password: zod_1.z.string({
        required_error: "Password is required",
        invalid_type_error: 'Password must be of type "String"',
    }).min(6)
});
exports.signinInput = exports.signupInput.pick({ username: true, password: true });
exports.userInput = exports.signupInput.pick({ name: true, username: true });
exports.languages = ["java", "python", "javascript"];
exports.code = ["helper", "driver", "solution", "result"];
exports.files = {
    java: ["Helper.java", "Driver.java", "Solution.java", "Result.java"],
    python: ["helper.py", "driver.py", "solution.py", "result.py"],
    javascript: ["helper.js", "driver.js", "solution.js", "result.js"]
};
exports.driverCode = {
    java: {
        helper: "",
        driver: "",
        solution: "",
        result: ""
    },
    python: {
        helper: "",
        driver: "",
        solution: "",
        result: ""
    },
    javascript: {
        helper: "",
        driver: "",
        solution: "",
        result: ""
    },
};
exports.initialDesc = '<p>Enter the problem description here...</p>';
exports.initialInputs = { name: "", type: "", add: true };
exports.initialProblem = { title: "", difficulty: "easy", description: exports.initialDesc, inputs: [exports.initialInputs,], testcase: "", driverCode: exports.driverCode };
