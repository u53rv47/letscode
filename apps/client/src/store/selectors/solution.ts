import { selector } from "recoil";
import { solutionState } from "../atoms/solution";
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
		if (state.solution)
			return state.solution.language;
		return "javascript";
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
		if (state.solution)
			return state.solution.value;
		return languages.javascript.value;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: { language: state.solution.language, value: newValue } }
		set(solutionState, newState);
	}
});