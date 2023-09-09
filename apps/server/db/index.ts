import mongoose from 'mongoose'
import fs from 'fs';
import path from 'path';


const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
	solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
	attempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
})

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
}, { timestamps: true })

/*problemSchema.pre("save", function (next) {
	if (fs.existsSync(this.testFilePath)) {
		const newTestFilePath = path.join("uploads", this.slug, this.testFilePath.split('_')[1])
		fs.rename(this.testFilePath, newTestFilePath, (err: Error) => {
			if (err)
				console.log("Test File couldn't be renamed");
		});
		this.testFilePath = newTestFilePath;
	}
	if (fs.existsSync(this.outputFilePath)) {
		const newTestFilePath = path.join("uploads", this.slug, this.outputFilePath.split('_')[1])
		fs.rename(this.outputFilePath, newTestFilePath, (err: Error) => {
			if (err)
				console.log("Output File couldn't be renamed");
		});
		this.outputFilePath = newTestFilePath;
	}
	next();
});*/

export const User = mongoose.model("User", userSchema);
export const Problem = mongoose.model("Problem", problemSchema);
