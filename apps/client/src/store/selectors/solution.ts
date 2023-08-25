import { selector } from "recoil";
import { solutionState, tempSolutionState, tempTestcaseState } from "../atoms/solution";
import { languages } from "../atoms/problem";

export const solutionDetails = selector({
	key: "solutionDetails",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: newValue }
		set(solutionState, newState);
	}
});

export const isSolutionLoading = selector({
	key: "isSolutionLoading",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.isLoading;
	}
});


export const solutionlanguage = selector({
	key: "solutionLanguage",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.language;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: { language: newValue, value: state.solution.value } }
		set(solutionState, newState);
	}
});


export const solutionValue = selector({
	key: "solutionValue",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.value;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: { language: state.solution.language, value: newValue } }
		set(solutionState, newState);
	}
});


export const solutionTestcase = selector({
	key: "solutionTestcase",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.testcase;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: { language: state.solution.language, value: state.solution.value, testcase: newValue } }
		set(solutionState, newState);
	}
});

export const tempSolution = selector({
	key: "tempSolution",
	get: ({ get }) => {
		return get(tempSolutionState);
	}
});

export const tempTestcase = selector({
	key: "tempTestcase",
	get: ({ get }) => {
		return get(tempTestcaseState);
	}
});