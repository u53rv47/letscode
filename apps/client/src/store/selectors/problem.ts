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
		const newState = { isLoading: state.isLoading, problem: { title: newValue, description: state.problem.description, inputs: state.problem.inputs, testcase: state.problem.testcase, driverCode: state.problem.driverCode } }
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
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: newValue, inputs: state.problem.inputs, testcase: state.problem.testcase, driverCode: state.problem.driverCode } }
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
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: state.problem.description, inputs: newInputs, testcase: state.problem.testcase, driverCode: state.problem.driverCode } }
		set(problemState, newState);
	}
});


export const problemTestcase = selector({
	key: "problemTestcase",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.testcase;
	},
	set: ({ set, get }, newTestcase) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: state.problem.description, inputs: state.problem.inputs, testcase: newTestcase, driverCode: state.problem.driverCode } }
		set(problemState, newState);
	}
});

export const problemDriverCode = selector({
	key: "driverCode",
	get: ({ get }) => {
		const state = get(problemState);
		return state.problem.driverCode;
	},
	set: ({ set, get }, newDriverCode) => {
		const state = get(problemState);
		const newState = { isLoading: state.isLoading, problem: { title: state.problem.title, description: state.problem.description, inputs: state.problem.inputs, testcase: state.problem.testcase, driverCode: newDriverCode } }
		set(problemState, newState);
	}
});