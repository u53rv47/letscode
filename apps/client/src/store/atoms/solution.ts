import { atom } from "recoil";

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


export const solutionState = atom({
	key: 'solutionState',
	default: {
		isLoading: true,
		solution: { language: "javascript", value: languages.javascript.value }
	},
});
