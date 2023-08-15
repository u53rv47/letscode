import { selector } from "recoil";
import { tempInputState, tempOutputState } from "../atoms/temp"


export const tempInputName = selector({
	key: "tempInputName",
	get: ({ get }) => {
		const state = get(tempInputState);
		return state.name;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempInputState);
		const newState = { name: newValue, type: state.type, add: state.add }
		set(tempInputState, newState);
	}
});

export const tempInputType = selector({
	key: "tempInputType",
	get: ({ get }) => {
		const state = get(tempInputState);
		return state.type;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempInputState);
		const newState = { name: state.name, type: newValue, add: state.add }
		set(tempInputState, newState);
	}
});

export const tempInputAdd = selector({
	key: "tempInputAdd",
	get: ({ get }) => {
		const state = get(tempInputState);
		return state.add;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempInputState);
		const newState = { name: state.name, type: state.type, add: newValue }
		set(tempInputState, newState);
	}
});


export const tempOutputName = selector({
	key: "tempOutputName",
	get: ({ get }) => {
		const state = get(tempOutputState);
		return state.name;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempOutputState);
		const newState = { name: newValue, type: state.type, add: state.add }
		set(tempOutputState, newState);
	}
});

export const tempOutputType = selector({
	key: "tempOutputType",
	get: ({ get }) => {
		const state = get(tempOutputState);
		return state.type;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempOutputState);
		const newState = { name: state.name, type: newValue, add: state.add }
		set(tempOutputState, newState);
	}
});

export const tempOutputAdd = selector({
	key: "tempOutputAdd",
	get: ({ get }) => {
		const state = get(tempOutputState);
		return state.add;
	},
	set: ({ set, get }, newValue) => {
		const state = get(tempOutputState);
		const newState = { name: state.name, type: state.type, add: newValue }
		set(tempOutputState, newState);
	}
});
