import { atom } from "recoil";

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialIO = { name: "", type: "", add: true }

export const initialProblem = { title: "", description: initialDesc, inputs: [initialIO,], outputs: [initialIO,], currInput: initialIO, currOutput: initialIO }

export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: initialProblem
	},
});
