"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPasswordSchema = exports.updateProfileSchema = exports.updateSignatureSchema = exports.updateAvatarSchema = void 0;
const zod_1 = require("zod");
exports.updateAvatarSchema = zod_1.z.object({
    body: zod_1.z.object({
        avatar: zod_1.z.string(),
    })
});
exports.updateSignatureSchema = zod_1.z.object({
    body: zod_1.z.object({
        signature: zod_1.z.string()
    })
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string()
            .trim().min(1, {
            message: "First name is required"
        }),
        lastName: zod_1.z.string()
            .trim().min(1, {
            message: "Last name is required"
        }),
        email: zod_1.z.string()
            .email({ message: "Invalid email address" }),
    })
});
exports.updateUserPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string()
            .trim().min(1, {
            message: "Current password is required"
        }),
        password: zod_1.z.string()
            .trim().min(8, {
            message: "Password must be at least 8 characters."
        })
            .refine(password => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        }, {
            message: 'Password must have uppercase, lowercase, number, and special characters (@$!%*?&).'
        }),
    })
});
