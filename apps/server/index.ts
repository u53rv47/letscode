require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from "./routes/user";
import problemRouter from "./routes/problem";
import solutionRouter from "./routes/solution";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/problem", problemRouter);
app.use("/solution", solutionRouter);

mongoose.connect(process.env.MONGODB_URL + 'letscode');

app.listen(3000, () => {
	console.log("Letscode is running on port 3000");
});