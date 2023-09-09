"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const auth_1 = __importStar(require("../middleware/auth"));
const db_1 = require("../db");
const common_1 = require("common");
const router = express_1.default.Router();
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    if (userId) {
        const user = yield db_1.User.findById(userId);
        if (user) {
            res.json({ message: "Success", user: { id: user._id, name: user.name, username: user.username, solved: user.solved, attempted: user.attempted } });
        }
    }
    else {
        res.status(400).json({ message: "Invalid credentials" });
    }
}));
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const credentials = common_1.signupInput.safeParse(req.body);
    if (!credentials.success) {
        res.status(400).json({ message: "Invalid credentials" });
    }
    else {
        const name = credentials.data.name;
        const username = credentials.data.username;
        const password = credentials.data.password;
        const user = yield db_1.User.findOne({ username });
        if (user) {
            res.status(403).json({ message: 'User already exists' });
        }
        else {
            let encryptedPassword = (0, auth_1.encrypt)(password);
            const newUser = new db_1.User({ name, username, password: encryptedPassword });
            yield newUser.save();
            const token = (0, auth_1.generateToken)(username, newUser.id);
            res.json({ message: 'User created successfully', token });
        }
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const credentials = common_1.signinInput.safeParse(req.body);
    if (!credentials.success) {
        res.status(400).json({ message: "Invalid credentials." });
    }
    else {
        const username = credentials.data.username;
        const password = credentials.data.password;
        const user = yield db_1.User.findOne({ username });
        if (user) {
            const decryptedPassword = (0, auth_1.decrypt)(user.password);
            if (password === decryptedPassword) {
                const token = (0, auth_1.generateToken)(username, user.id);
                res.json({ message: 'Logged in successfully.', token });
            }
            else
                res.status(400).json({ message: "Incorrect password." });
        }
        else
            res.status(400).json({ message: "Incorrect username / Does not exists." });
    }
}));
router.delete("/delete", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield db_1.User.deleteOne({ username: req.user.username });
    if (deleted)
        res.json({ message: "User deleted successfully" });
    else
        res.sendStatus(404);
}));
exports.default = router;
