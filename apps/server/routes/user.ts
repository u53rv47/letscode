import express, { Request, Response } from "express";
import authenticateJwt, { generateToken, encrypt, decrypt } from "../middleware/auth";
import { User, Problem } from "../db"
import { signupInput, signinInput } from "common";
import mongoose from "mongoose";

const router = express.Router();

router.get('/', authenticateJwt, async (req, res) => {
	const userId = req.user.userId;
	if (userId) {
		const user = await User.findById(userId);
		if (user) {
			res.json({ message: "Success", user: { id: user._id, name: user.name, username: user.username, solved: user.solved, attempted: user.attempted } })
		}
	}
	else {
		res.status(400).json({ message: "Invalid credentials" });
	}
});

router.post("/signup", async (req, res) => {
	console.log(req.body);
	const credentials = signupInput.safeParse(req.body);
	if (!credentials.success) {
		res.status(400).json({ message: "Invalid credentials" });
	} else {
		const name = credentials.data.name;
		const username = credentials.data.username;
		const password = credentials.data.password;

		const user = await User.findOne({ username });
		if (user) {
			res.status(403).json({ message: 'User already exists' });
		} else {
			let encryptedPassword = encrypt(password);
			const newUser = new User({ name, username, password: encryptedPassword });
			await newUser.save();
			const token = generateToken(username, newUser.id);
			res.json({ message: 'User created successfully', token, name: user.name });
		}
	}

});


router.post("/signin", async (req: Request, res: Response) => {
	const credentials = signinInput.safeParse(req.body);
	if (!credentials.success) {
		res.status(400).json({ message: "Invalid credentials." });
	}
	else {
		const username = credentials.data.username;
		const password = credentials.data.password;

		const user = await User.findOne({ username });
		if (user) {
			const decryptedPassword = decrypt(user.password);
			if (password === decryptedPassword) {
				const token = generateToken(username, user.id);
				res.json({ message: 'Logged in successfully.', token, name: user.name });

			} else res.status(400).json({ message: "Incorrect password." });

		} else res.status(400).json({ message: "Incorrect username / Does not exists." })
	}

})

router.delete("/delete", authenticateJwt, async (req, res) => {
	const deleted = await User.deleteOne({ username: req.user.username });
	if (deleted)
		res.json({ message: "User deleted successfully" });
	else res.sendStatus(404);
})

export default router;