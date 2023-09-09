import { atom } from "recoil";

let iSolved: string[] = []
let iAttempted: string[] = []

export const initialUser = { id: "", name: "", username: "", solved: iSolved, attempted: iAttempted }

export const userState = atom({
	key: 'userState',
	default: {
		isLoading: true,
		user: initialUser
	},
});