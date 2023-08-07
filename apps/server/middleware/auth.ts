import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import mongoose from "mongoose";
require('dotenv').config();

const SECRET = process.env.SECRET;
const KEY = process.env.KEY;

export function encrypt(password: string): string {
	return CryptoJS.AES.encrypt(password, KEY).toString();
}

export function decrypt(hash: string): string {
	return CryptoJS.AES.decrypt(hash, KEY).toString(CryptoJS.enc.Utf8);
}

export function generateToken(username: string, userId: mongoose.Schema.Types.ObjectId): string {
	return jwt.sign({ username, userId }, SECRET, { expiresIn: '7d' })
}

function authenticateJwt(req, res, next) {
	const authHeader: string = req.headers.authorization;
	if (authHeader) {
		const token: string = authHeader.split(' ')[1]
		jwt.verify(token, SECRET, (err, user) => {
			if (err)
				res.status(403).send({ message: "Invalid token" });
			req.user = user;
			next();
		});
	} else {
		res.status(401).send({ message: "Invalid request" });
	}
}

export default authenticateJwt;