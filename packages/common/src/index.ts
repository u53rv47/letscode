import { z } from 'zod'


export const signupInput = z.object({
	name: z.string({
		required_error: "Username is required",
		invalid_type_error: 'Username must be of type "String"',
	}),
	username: z.string({
		required_error: "Username is required",
		invalid_type_error: 'Username must be of type "String"',
	}).min(6),
	password: z.string({
		required_error: "Password is required",
		invalid_type_error: 'Password must be of type "String"',
	}).min(6)
})


export const signinInput = signupInput.pick({ username: true, password: true });
export const userInput = signupInput.pick({ name: true, username: true });

export type SignupParams = z.infer<typeof signupInput>;
export type SigninParams = z.infer<typeof signinInput>;
export type UserParams = z.infer<typeof userInput>;


export const languages = ["java", "python", "javascript"];
export const code = ["helper", "driver", "solution", "result"];
export const files = {
	java: ["Helper.java", "Driver.java", "Solution.java", "Result.java"],
	python: ["helper.py", "driver.py", "solution.py", "result.py"],
	javascript: ["helper.js", "driver.js", "solution.js", "result.js"]
};

export interface LanguageCode {
	helper: string;
	driver: string;
	solution: string;
	result: string;
}

export const driverCode: Record<string, LanguageCode> = {
	java: {
		helper: "",
		driver: "",
		solution: "",
		result: ""
	},
	python: {
		helper: "",
		driver: "",
		solution: "",
		result: ""
	},
	javascript: {
		helper: "",
		driver: "",
		solution: "",
		result: ""
	},
};

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialInputs = { name: "", type: "", add: true }

export const initialProblem = { title: "", difficulty: "easy", description: initialDesc, inputs: [initialInputs,], testcase: "", driverCode }