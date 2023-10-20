import { atom } from "recoil";
// import { driverCode } from "common";
import { code } from "common";

console.log(code);
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

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialInputs = { name: "", type: "", add: true }

export const initialProblem = { title: "", difficulty: "easy", description: initialDesc, inputs: [initialInputs,], testcase: "", driverCode }

export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: initialProblem
	},
});


const files: File[] = []
export const fileState = atom({
	key: "fileState",
	default: files
})



/*
export const titileState = atom({
	key: "titleState",
	default: ""
})

export const descriptionState = atom({
	key: "descriptionState",
	default: initialDesc
})

export const difficultyState = atom({
	key: "difficultyState",
	default: "easy"
})

export const inputsState = atom({
	key: "inputsState",
	default: initialInputs
})

export const testcaseState = atom({
	key: "testcaseState",
	default: ""
})

export const driverCodeState = atom({
	key: "driverCodeState",
	default: languages
})
*/