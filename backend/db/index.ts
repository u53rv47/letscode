import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
	attempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
})

const problemSchema = new mongoose.Schema({
	title: String,
	description: String,
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

export const User = mongoose.model("User", userSchema);
export const Problem = mongoose.model("Problem", problemSchema);
