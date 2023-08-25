import { atom } from "recoil";
import { languages } from "./problem";


export const solutionState = atom({
	key: 'solutionState',
	default: {
		isLoading: true,
		solution: { language: "java", value: languages.java.value, testcase: "" }
	},
});


export const tempSolutionState = atom({
	key: "tempSolutionState",
	default: { language: "java", value: languages.java.value }
})

export const tempTestcaseState = atom({
	key: "tempTestcaseState",
	default: ""
})