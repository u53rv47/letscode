"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Problem = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const URLSlug = require("mongoose-slug-generator");
mongoose_1.default.plugin(URLSlug);
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    solved: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }],
    attempted: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Problem' }]
});
const problemSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    inputs: [{ name: { type: String }, type: { type: String } }],
    testcase: String,
    driverCode: { java: { language: { type: String }, value: { type: String } }, python: { language: { type: String }, value: { type: String } }, javascript: { language: { type: String }, value: { type: String } } },
    slug: String,
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
problemSchema.pre("save", function (next) {
    const cleanedTitle = this.title.replace(/^[0-9.]+/, '').trim();
    this.slug = cleanedTitle.split(' ').join('-').toLowerCase();
    console.log(this.slug);
    next();
});
exports.User = mongoose_1.default.model("User", userSchema);
exports.Problem = mongoose_1.default.model("Problem", problemSchema);
