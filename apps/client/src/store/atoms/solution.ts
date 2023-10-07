import { atom } from "recoil";
import { languages } from "../constants";
import { initialInputs } from "../constants";

export const initialSolution = {
	title: "", description: "", testcase: "", inputs: [initialInputs,],
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

interface Output {
	message?: string;
	error?: string;
	output?: string;
	actual_output?: string;
	expected_output?: string;
	console_output?: string;
	failed_testcases?: string;
	input?: string;
}
const initialOutput: Output = {}
export const responseState = atom({
	key: "responseState",
	default: {
		result: "",
		output: initialOutput
	}
})

// true for run and false for submit
export const actionState = atom({
	key: "actionState",
	default: {
		isLoading: true,
		action: true
	}
});