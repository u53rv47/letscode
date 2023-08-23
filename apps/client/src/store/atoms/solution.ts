import { atom } from "recoil";
import { languages } from "./problem";

export const solutionState = atom({
	key: 'solutionState',
	default: {
		isLoading: true,
		solution: { language: "java", value: languages.java.value }
	},
});
