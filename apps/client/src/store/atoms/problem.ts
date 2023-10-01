import { atom } from "recoil";
import { initialDesc, initialInputs, languages } from "../constants";



export const initialProblem = { title: "", difficulty: "easy", description: initialDesc, inputs: [initialInputs,], testcase: "", driverCode: languages }

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