import express, { Express, Request, Response } from "express";
import authenticateJwt from "../middleware/auth";
import { Problem } from "../db"

const router = express.Router();


router.get("/", async (req: Request, res: Response) => {
	try {
		let problems = await Problem.find({}).select("_id, title");
		res.status(200).json(problems);
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});

router.get("/:slug", async (req: Request, res: Response) => {
	const slug = req.params.slug;
	try {
		let problem = await Problem.findOne({ slug });
		res.status(200).json(problem);
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});

router.post("/publish", authenticateJwt, async (req: Request, res: Response) => {
	const { title, description, inputs, testcase, driverCode } = req.body;
	if (title && description) {
		let problem = await Problem.findOne({ title });
		if (problem)
			res.status(403).json({ message: 'Problem already exists' })
		else {

			problem = new Problem({ title, description, inputs, testcase, driverCode, userId: req.user.userId });
			await problem.save();
			res.send({ id: problem.id, message: "Problem published successfully" });
		}
	} else res.status(400).send({ message: "Invalid request" });
});

export default router;