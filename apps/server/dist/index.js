"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const problem_1 = __importDefault(require("./routes/problem"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", user_1.default);
app.use("/problem", problem_1.default);
mongoose_1.default.connect(process.env.MONGODB_URL + 'letscode');
app.listen(3000, () => {
    console.log("Letscode is running on port 3000");
});
