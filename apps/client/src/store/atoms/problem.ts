import { atom } from "recoil";

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialInputs = { name: "", type: "", add: true }
export const languages = {
	"java": {
		language: 'java',
		value:
			`class Solution{
	public static void main(String[] args){
		System.out.println("Hello World");
	}
}`
	},
	"python": {
		language: 'python',
		value: 'print("Hello World")',
	},
	"javascript": {
		language: 'javascript',
		value: 'console.log("Hello World")'
	}
};

export const initialProblem = { title: "", description: initialDesc, inputs: [initialInputs,], testcase: "", driverCode: languages }

export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: initialProblem
	},
});