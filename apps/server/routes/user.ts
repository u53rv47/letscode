import express, { Request, Response } from "express";
import authenticateJwt, { generateToken, encrypt, decrypt } from "../middleware/auth";
import { User, Problem } from "../db"
import { signupInput } from "common";

const router = express.Router();

router.post("/signup", async (req, res) => {
	const credentials = signupInput.safeParse(req.body);
	if (!credentials.success) {
		res.status(400).json({ message: "Invalid credentials" });
	} else {
		const username = credentials.data.username;
		const password = credentials.data.password;

		const user = await User.findOne({ username });
		if (user) {
			res.status(403).json({ message: 'User already exists' });
		} else {
			let encryptedPassword = encrypt(password);
			const newUser = new User({ username, password: encryptedPassword });
			await newUser.save();
			const token = generateToken(username, newUser.id);
			res.json({ message: 'User created successfully', token });
		}
	}

});



router.post("/signin", async (req: Request, res: Response) => {
	const credentials = signupInput.safeParse(req.body);
	if (!credentials.success) {
		res.status(400).json({ message: "Invalid credentials" });
	}
	else {
		const username = credentials.data.username;
		const password = credentials.data.password;

		const user = await User.findOne({ username });
		if (user) {
			const decryptedPassword = decrypt(user.password);
			if (password === decryptedPassword) {
				const token = generateToken(username, user.id);
				res.json({ message: 'Logged in successfully', token });

			} else res.status(400).json({ message: "Incorrect password" });

		} else res.status(400).json({ message: "Incorrect username / Does not exists" })
	}

})

router.delete("/delete", authenticateJwt, async (req, res) => {
	const deleted = await User.deleteOne({ username: req.user.username });
	if (deleted)
		res.json({ message: "User deleted successfully" });
	else res.sendStatus(404);
})

export default router;