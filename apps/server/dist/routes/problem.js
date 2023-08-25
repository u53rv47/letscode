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
const auth_1 = __importDefault(require("../middleware/auth"));
const db_1 = require("../db");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let problems = yield db_1.Problem.find({}).select("_id, title");
        res.status(200).json(problems);
    }
    catch (err) {
        res.status(404).send({ message: "Not found", error: err });
    }
}));
router.get("/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        let problem = yield db_1.Problem.findOne({ slug });
        res.status(200).json(problem);
    }
    catch (err) {
        res.status(404).send({ message: "Not found", error: err });
    }
}));
router.post("/publish", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, inputs, testcase, driverCode } = req.body;
    if (title && description) {
        let problem = yield db_1.Problem.findOne({ title });
        if (problem)
            res.status(403).json({ message: 'Problem already exists' });
        else {
            problem = new db_1.Problem({ title, description, inputs, testcase, driverCode, userId: req.user.userId });
            yield problem.save();
            res.send({ id: problem.id, message: "Problem published successfully" });
        }
    }
    else
        res.status(400).send({ message: "Invalid request" });
}));
exports.default = router;
