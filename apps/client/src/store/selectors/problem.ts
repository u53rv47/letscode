import { selector } from "recoil";
import { problemState } from "../atoms/problem";
import { initialValue } from "../atoms/problem";

export const problemDetails = selector({
	key: "problemDetails",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem;
	},
	set: ({ set, get }, newValue) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: newValue }
		set(problemState, newState);
	}
});

export const isProblemLoading = selector({
	key: "isProblemLoading",
	get: ({ get }) => {
		const state = get(problemState);
		return state.isLoading;
	}
});


export const problemTitle = selector({
	key: "problemTitle",
	get: ({ get }) => {
		const state = get(problemState);
		if (state.problem)
			return state.problem.title;
		return "";
	},
	set: ({ set, get }, newValue) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: newValue, description: state.problem.description } }
		set(problemState, newState);
	}
});


export const problemDescription = selector({
	key: "problemDescription",
	get: ({ get }) => {
		const state = get(problemState);
		if (state.problem)
			return state.problem.description;
		return initialValue;
	},
	set: ({ set, get }, newValue) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: newValue } }
		set(problemState, newState);
	}
});