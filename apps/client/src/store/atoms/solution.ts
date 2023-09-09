import { atom } from "recoil";
import { languages } from "./problem";
import { initialIO } from "./temp";

export const initialSolution = {
	title: "", description: "", testcase: "", inputs: [initialIO,],
	result: { java: "", python: "", javascript: "" }
}

export const solutionState = atom({
	key: 'solutionState',
	default: {
		isLoading: true,
		solution: initialSolution
	},
});


export const resultState = atom({
	key: "resultState",
	default: { language: "java", result: languages.java.result }
})

export const testcaseState = atom({
	key: "testcaseState",
	default: ""
})
