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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const multer_1 = __importDefault(require("multer"));
const db_1 = require("../db");
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const fileHandler_1 = require("../utils/fileHandler");
const common_1 = require("common");
const drivers_1 = __importDefault(require("../drivers"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const slug = slugify(req.body.title);
        const uploadDirectory = path_1.default.join("uploads", slug);
        if (!fs_extra_1.default.existsSync(uploadDirectory)) {
            fs_extra_1.default.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const fileUpload = (0, multer_1.default)({ storage });
function slugify(title) {
    const cleanedTitle = title.replace(/^[0-9.]+/, '').trim();
    return cleanedTitle.split(' ').join('-').toLowerCase();
}
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problems = yield db_1.Problem.find({}).select(["_id", "title", "userId"]);
        res.status(200).json(problems);
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ message: "Not found", error: err });
    }
}));
router.get("/initial", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, drivers_1.default)();
    }
    finally {
        res.status(200).json(common_1.initialProblem);
    }
}));
router.get("/:slug", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const problem = yield db_1.Problem.findOne({ slug });
        const result = { title: problem.title, difficulty: problem.difficulty, description: problem.description, inputs: problem.inputs, testcase: problem.testcase, driverCode: problem.driverCode };
        res.status(200).json(result);
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ message: "Not found", error: err });
    }
}));
router.post("/publish", auth_1.default, fileUpload.array("files", 2), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, difficulty, description, inputs, testcase, driverCode } = req.body;
    const slug = slugify(title);
    if (title && description) {
        let problem = yield db_1.Problem.findOne({ title });
        if (problem)
            res.status(400).json({ message: 'Problem already exists' });
        else {
            let [testFilePath, outputFilePath] = ["", ""];
            if (req.files.length !== 0) {
                [testFilePath, outputFilePath] = (req.files[0].originalname.toLowerCase() === "testcase.txt") ? [path_1.default.join('uploads', slug, req.files[0].filename.toLowerCase()), path_1.default.join('uploads', slug, req.files[1].filename.toLowerCase())] : [path_1.default.join('uploads', slug, req.files[1].filename.toLowerCase()), path_1.default.join('uploads', slug, req.files[0].filename.toLowerCase())];
            }
            problem = new db_1.Problem({ title, difficulty, description, inputs: JSON.parse(inputs), testcase, driverCode: JSON.parse(driverCode), slug, testFilePath, outputFilePath, userId: req.user.userId });
            yield problem.save();
            (0, fileHandler_1.writeDriverFilesSync)(slug, driverCode);
            res.status(200).send({ id: problem.id, message: "Problem published successfully" });
        }
    }
    else
        res.status(400).send({ message: "Invalid request" });
}));
router.patch('/:slug', auth_1.default, fileUpload.array("files", 2), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const updatedProblem = req.body;
        updatedProblem.inputs = JSON.parse(updatedProblem.inputs);
        updatedProblem.driverCode = JSON.parse(updatedProblem.driverCode);
        if (req.files.length !== 0)
            [updatedProblem.testFilePath, updatedProblem.outputFilePath] = (req.files[0].originalname.toLowerCase() === "testcase.txt") ? [path_1.default.join('uploads', req.files[0].filename.toLowerCase()), path_1.default.join('uploads', req.files[1].filename.toLowerCase())] : [path_1.default.join('uploads', req.files[1].filename.toLowerCase()), path_1.default.join('uploads', req.files[0].filename.toLowerCase())];
        (0, fileHandler_1.writeDriverFilesSync)(slug, updatedProblem.driverCode);
        yield db_1.Problem.updateOne({ slug }, updatedProblem);
        res.status(200).send({ message: "Problem updated successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(400).send({ message: "Not found", error: err });
    }
}));
exports.default = router;
