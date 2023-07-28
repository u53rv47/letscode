import mongoose from 'mongoose';
require('dotenv').config();
import express from 'express';
import cors from 'cors';
import userRouter from "./routes/user";
import problemRouter from "./routes/problem";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/problem", problemRouter);

mongoose.connect(process.env.MONGODB_URL + 'letscode');

app.listen(3000, () => {
	console.log("Letscode is running on port 3000");
});