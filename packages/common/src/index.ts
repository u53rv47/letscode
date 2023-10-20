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
export const code = ["driver", "solution", "result"];
export const files = {
	java: ["Driver.java", "Solution.java", "Result.java"],
	python: ["driver.py", "solution.py", "result.py"],
	javascript: ["driver.js", "solution.js", "result.js"]
};

export interface LanguageCode {
	driver: string;
	solution: string;
	result: string;
}

export const driverCode: Record<string, LanguageCode> = {
	java: {
		driver: "",
		solution: "",
		result: ""
	},
	python: {
		driver: "",
		solution: "",
		result: ""
	},
	javascript: {
		driver: "",
		solution: "",
		result: ""
	},
};
