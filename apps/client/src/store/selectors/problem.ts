import { selector } from "recoil";
import { problemState } from "../atoms/problem";

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
		return state.problem.title;
	},
	set: ({ set, get }, newValue) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: newValue, description: state.problem.description, inputs: state.problem.inputs, outputs: state.problem.outputs } }
		set(problemState, newState);
	}
});


export const problemDescription = selector({
	key: "problemDescription",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.description;
	},
	set: ({ set, get }, newValue) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: newValue, inputs: state.problem.inputs, outputs: state.problem.outputs } }
		set(problemState, newState);
	}
});

export const problemInputs = selector({
	key: "problemInputs",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.inputs;
	},
	set: ({ set, get }, newInputs) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: state.problem.description, inputs: newInputs, outputs: state.problem.outputs } }
		set(problemState, newState);
	}
});

export const problemOutputs = selector({
	key: "problemOutputs",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.outputs;
	},
	set: ({ set, get }, newOutputs) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: state.problem.description, inputs: state.problem.inputs, outputs: newOutputs } }
		set(problemState, newState);
	}
});

export const inputSize = selector({
	key: "inputSize",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.inputs.length;
	}
});