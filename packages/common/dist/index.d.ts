import { z } from 'zod';
export declare const signupInput: z.ZodObject<{
    name: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
    password: string;
}, {
    name: string;
    username: string;
    password: string;
}>;
export declare const signinInput: z.ZodObject<Pick<{
    name: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "username" | "password">, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const userInput: z.ZodObject<Pick<{
    name: z.ZodString;
    username: z.ZodString;
    password: z.ZodString;
}, "name" | "username">, "strip", z.ZodTypeAny, {
    name: string;
    username: string;
}, {
    name: string;
    username: string;
}>;
export type SignupParams = z.infer<typeof signupInput>;
export type SigninParams = z.infer<typeof signinInput>;
export type UserParams = z.infer<typeof userInput>;
export declare const languages: string[];
export declare const code: string[];
export declare const files: {
    java: string[];
    python: string[];
    javascript: string[];
};
export interface LanguageCode {
    driver: string;
    solution: string;
    result: string;
}
export declare const driverCode: Record<string, LanguageCode>;
