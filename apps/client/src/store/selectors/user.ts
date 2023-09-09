import { selector } from "recoil";
import { userState } from "../atoms/user";

export const userDetails = selector({
	key: 'userDetails',
	get: ({ get }) => {
		const state = get(userState);
		return state.user;
	},
	set: ({ set, get }, newValue) => {
		const state = get(userState);
		const newState = { isLoading: state.isLoading, user: newValue };
		set(userState, newState);
	}
});

export const isUserLoading = selector({
	key: "isUserLoading",
	get: ({ get }) => {
		const state = get(userState);
		return state.isLoading;
	}
});


export const userIdState = selector({
	key: "userIdState",
	get: ({ get }) => {
		const state = get(userState);
		return state.user.id;
	}
});

export const nameState = selector({
	key: "nameState",
	get: ({ get }) => {
		const state = get(userState);
		return state.user.name;
	}
});

export const usernameState = selector({
	key: "usernameState",
	get: ({ get }) => {
		const state = get(userState);
		return state.user.username;
	}
});

export const solvedState = selector({
	key: "solvedState",
	get: ({ get }) => {
		const state = get(userState);
		return state.user.solved;
	}
});

export const attemptedState = selector({
	key: "attemptedState",
	get: ({ get }) => {
		const state = get(userState);
		return state.user.attempted;
	}
});