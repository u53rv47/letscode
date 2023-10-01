import fs from "fs";
import path from 'path';
import multer from 'multer';
import express, { Request, Response } from "express";
import authenticateJwt from "../middleware/auth";
import { Problem } from "../db"

interface FileRequest extends express.Request {
	testFile: Express.Multer.File;
	outputFile: Express.Multer.File;
}

function slugify(title: string): string {
	const cleanedTitle = title.replace(/^[0-9.]+/, '').trim();
	return cleanedTitle.split(' ').join('-').toLowerCase();
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const slug = slugify(req.body.title)

		const uploadDirectory = path.join("uploads", slug)
		if (!fs.existsSync(uploadDirectory)) {
			fs.mkdirSync(uploadDirectory, { recursive: true });
		}
		cb(null, uploadDirectory)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	},
});

const fileUpload = multer({ storage })

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		const problems = await Problem.find({}).select(["_id", "title", "userId"]);
		res.status(200).json(problems);
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});

router.get("/:slug", async (req: Request, res: Response) => {
	const slug = req.params.slug;
	try {
		const problem = await Problem.findOne({ slug });
		res.status(200).json(problem);
	} catch (err) {
		res.status(404).send({ message: "Not found", error: err });
	}
});

router.post("/publish", authenticateJwt, fileUpload.array("files", 2), async (req: FileRequest, res: Response) => {
	const { title, difficulty, description, inputs, testcase, driverCode } = req.body;
	const slug = slugify(title);

	if (title && description) {
		let problem = await Problem.findOne({ title });
		if (problem)
			res.status(403).json({ message: 'Problem already exists' })
		else {
			if (req.files.length !== 0) {
				const [testFilePath, outputFilePath] = (req.files[0].originalname.toLowerCase() === "testcase.txt") ? [path.join('uploads', slug, req.files[0].filename.toLowerCase()), path.join('uploads', slug, req.files[1].filename.toLowerCase())] : [path.join('uploads', slug, req.files[1].filename.toLowerCase()), path.join('uploads', slug, req.files[0].filename.toLowerCase())];

				problem = new Problem({ title, difficulty, description, inputs: JSON.parse(inputs), testcase, driverCode: JSON.parse(driverCode), slug, testFilePath, outputFilePath, userId: req.user.userId });

				await problem.save();
				res.status(200).send({ id: problem.id, message: "Problem published successfully" });
			}
			else res.status(400).json({ message: 'File could not be uploaded' });
		}
	} else res.status(400).send({ message: "Invalid request" });
});

router.patch('/:slug', authenticateJwt, fileUpload.array("files", 2), async (req: FileRequest, res: Response) => {
	const slug = req.params.slug;
	try {
		const updatedProblem = req.body;
		updatedProblem.inputs = JSON.parse(updatedProblem.inputs);
		updatedProblem.driverCode = JSON.parse(updatedProblem.driverCode);

		if (req.files.length !== 0)
			[updatedProblem.testFilePath, updatedProblem.outputFilePath] = (req.files[0].originalname.toLowerCase() === "testcase.txt") ? [path.join('uploads', req.files[0].filename.toLowerCase()), path.join('uploads', req.files[1].filename.toLowerCase())] : [path.join('uploads', req.files[1].filename.toLowerCase()), path.join('uploads', req.files[0].filename.toLowerCase())];

		await Problem.updateOne({ slug }, updatedProblem);
		res.status(200).send({ message: "Problem updated successfully" });

	} catch (err) {
		console.log(err)
		res.status(404).send({ message: "Not found", error: err });
	}
})
export default router;