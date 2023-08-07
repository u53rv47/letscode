import { atom } from "recoil";

export const initialValue = '<p>Enter the problem description here...</p>'

export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: { title: "", description: initialValue }
	},
});
