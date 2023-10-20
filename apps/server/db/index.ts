import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
	attempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
}, { timestamps: true })

const problemSchema = new mongoose.Schema({
	title: String,
	difficulty: String,
	description: String,
	inputs: [
		{
			name: { type: String },
			type: { type: String }
		}
	],
	testcase: String,
	driverCode: {
		java: {
			result: { type: String },
			driver: { type: String },
			solution: { type: String }
		},
		python: {
			result: { type: String },
			driver: { type: String },
			solution: { type: String }
		},
		javascript: {
			result: { type: String },
			driver: { type: String },
			solution: { type: String }
		}
	},

	slug: String,
	testFilePath: String,
	outputFilePath: String,

	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const solutionSchema = new mongoose.Schema({
	language: String,
	solution: String,

	problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export const Problem = mongoose.model("Problem", problemSchema);
export const Solution = mongoose.model("Solution", solutionSchema);