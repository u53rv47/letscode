"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.decrypt = exports.encrypt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
require('dotenv').config();
const SECRET = process.env.SECRET;
const KEY = process.env.KEY;
function encrypt(password) {
    return crypto_js_1.default.AES.encrypt(password, KEY).toString();
}
exports.encrypt = encrypt;
function decrypt(hash) {
    return crypto_js_1.default.AES.decrypt(hash, KEY).toString(crypto_js_1.default.enc.Utf8);
}
exports.decrypt = decrypt;
function generateToken(username, userId) {
    return jsonwebtoken_1.default.sign({ username, userId }, SECRET, { expiresIn: '7d' });
}
exports.generateToken = generateToken;
function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(token, SECRET, (err, user) => {
            if (err)
                res.status(403).send({ message: "Invalid token" });
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).send({ message: "Invalid request" });
    }
}
exports.default = authenticateJwt;
