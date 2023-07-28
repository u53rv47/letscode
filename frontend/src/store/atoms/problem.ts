import { atom } from "recoil";
import { Descendant } from "slate";

export const initialValue: Descendant[] = [{
	type: 'paragraph',
	children: [
		{ text: 'Enter the problem description here...' },
	]
},];


export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: { title: "", description: initialValue }
	},
});
