import mongoose from 'mongoose'
const URLSlug = require("mongoose-slug-generator");

mongoose.plugin(URLSlug);

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
	solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
	attempted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
})

const problemSchema = new mongoose.Schema({
	title: String,
	description: String,
	inputs: [{ name: { type: String }, type: { type: String } }],
	testcase: String,
	driverCode: { java: { language: { type: String }, value: { type: String } }, python: { language: { type: String }, value: { type: String } }, javascript: { language: { type: String }, value: { type: String } } },
	slug: String,

	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

problemSchema.pre("save", function (next) {
	const cleanedTitle = this.title.replace(/^[0-9.]+/, '').trim();
	this.slug = cleanedTitle.split(' ').join('-').toLowerCase();
	console.log(this.slug)
	next();
});

export const User = mongoose.model("User", userSchema);
export const Problem = mongoose.model("Problem", problemSchema);
