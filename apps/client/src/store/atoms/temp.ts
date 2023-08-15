import { atom } from "recoil";

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialIO = { name: "", type: "Variable", add: true }

export const initialProblem = { title: "", description: initialDesc, inputs: [initialIO,], outputs: [initialIO,] }

export const tempInputState = atom({
	key: 'tempInputState',
	default: initialIO
});

export const tempOutputState = atom({
	key: 'tempOutputState',
	default: initialIO
});
