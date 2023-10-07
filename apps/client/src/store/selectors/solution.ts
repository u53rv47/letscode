import { selector } from "recoil";
import { responseState, solutionState } from "../atoms/solution";

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


export const solutionTitle = selector({
	key: "solutionTitle",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.title;
	}
});


export const solutionDescription = selector({
	key: "solutionDescription",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.description;
	}
});

export const solutionInputs = selector({
	key: "solutionInputs",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.inputs;
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
		const newState = { isLoading: state.isLoading, solution: { title: state.solution.title, description: state.solution.description, inputs: state.solution.inputs, testcase: newValue, result: state.solution.result } }
		set(solutionState, newState);
	}
});

export const solutionResult = selector({
	key: "solutionResult",
	get: ({ get }) => {
		const state = get(solutionState);
		return state.solution.result;
	},
	set: ({ set, get }, newValue) => {
		const state = get(solutionState);
		const newState = { isLoading: state.isLoading, solution: { title: state.solution.title, description: state.solution.description, inputs: state.solution.inputs, testcase: state.solution.testcase, result: newValue } }
		set(solutionState, newState);
	}
});

export const responseResult = selector({
	key: "responseResult",
	get: ({ get }) => {
		const state = get(responseState);
		return state.result;
	},
	set: ({ set, get }, newValue) => {
		const state = get(responseState);
		const newState = { result: newValue, output: state.output };
		set(responseState, newState);
	}
})

export const responseOutput = selector({
	key: "responseOutput",
	get: ({ get }) => {
		const state = get(responseState);
		return state.output;
	},
	set: ({ set, get }, newValue) => {
		const state = get(responseState);
		const newState = { result: state.result, output: newValue };
		set(responseState, newState);
	}
})