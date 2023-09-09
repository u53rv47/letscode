"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: String,
    username: String,
    password: String,
    solved: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }],
    attempted: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }]
});
const problemSchema = new mongoose_1.default.Schema({
    title: String,
    difficulty: String,
    description: String,
    inputs: [
        {
            name: { type: String },
            type: { type: String }
        }
    ],
    testcase: String,
    driverCode: {
        java: {
            result: { type: String },
            driver: { type: String },
            solution: { type: String }
        },
        python: {
            result: { type: String },
            driver: { type: String },
            solution: { type: String }
        },
        javascript: {
            result: { type: String },
            driver: { type: String },
            solution: { type: String }
        }
    },
    slug: String,
    testFilePath: String,
    outputFilePath: String,
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
exports.Problem = mongoose_1.default.model("Problem", problemSchema);
