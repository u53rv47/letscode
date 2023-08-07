"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupInput = void 0;
const zod_1 = require("zod");
// const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
// 	if (issue.code === z.ZodIssueCode.too_small) {
// 		if (issue.minimum === 6) {
// 			return { message: "Username must be more than 6 characters" };
// 		}
// 	}
// 	if (issue.code === z.ZodIssueCode.too_big) {
// 		if (issue.maximum === 12) {
// 			return { message: "Username must be less than 12 characters" };
// 		}
// 	}
// 	if (issue.code === z.ZodIssueCode.custom) {
// 		return { message: `less-than-${(issue.params || {}).minimum}` };
// 	}
// 	return { message: ctx.defaultError };
// };
exports.signupInput = zod_1.z.object({
    username: zod_1.z.string({
        required_error: "Username is required",
        invalid_type_error: 'Username must be of type "String"',
    }).min(6).max(12),
    password: zod_1.z.string({
        required_error: "Password is required",
        invalid_type_error: 'Password must be of type "String"',
    }).min(6)
});
