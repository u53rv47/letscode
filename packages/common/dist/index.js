"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverCode = exports.files = exports.code = exports.languages = exports.userInput = exports.signinInput = exports.signupInput = void 0;
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
exports.code = ["driver", "solution", "result"];
exports.files = {
    java: ["Driver.java", "Solution.java", "Result.java"],
    python: ["driver.py", "solution.py", "result.py"],
    javascript: ["driver.js", "solution.js", "result.js"]
};
exports.driverCode = {
    java: {
        driver: "",
        solution: "",
        result: ""
    },
    python: {
        driver: "",
        solution: "",
        result: ""
    },
    javascript: {
        driver: "",
        solution: "",
        result: ""
    },
};
