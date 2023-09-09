import { atom } from "recoil";

export const initialDesc = '<p>Enter the problem description here...</p>'
export const initialInputs = { name: "", type: "", add: true }
export const languages = {
	java: {
		result:
			`class Result{
	public static void main(String[] args){
		System.out.println("Hello World");
	}
}`,
		driver: "driver",
		solution: "solution",
	},
	python: {
		result: 'print("Hello World")',
		driver: "driver",
		solution: "solution",
	},
	javascript: {
		result: 'console.log("Hello World")',
		driver: "driver",
		solution: "solution",
	}
};

export const initialProblem = { title: "", difficulty: "easy", description: initialDesc, inputs: [initialInputs,], testcase: "", driverCode: languages }

export const problemState = atom({
	key: 'problemState',
	default: {
		isLoading: true,
		problem: initialProblem
	},
});

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

const files: File[] = []
export const fileState = atom({
	key: "fileState",
	default: files
})