"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.updateUserSchema = exports.createUserSchema = exports.getUsersSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.getUsersSchema = zod_1.z.object({
    query: zod_1.z.object({
        skip: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid skip value'
        }).optional(),
        take: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid take value'
        }).optional(),
        search: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
        type: zod_1.z.enum([client_1.UserType.ADMIN, client_1.UserType.EMPLOYEE]).optional()
    })
});
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
        userType: zod_1.z.enum([
            client_1.UserType.ADMIN,
            client_1.UserType.EMPLOYEE,
        ]),
        permission: zod_1.z.enum([
            client_1.PermissionType.SUPER_ADMIN,
            client_1.PermissionType.SUPERVISOR,
            client_1.PermissionType.ACCOUNTING,
            client_1.PermissionType.RESERVATION
        ]),
        officeBranch: zod_1.z.enum([
            client_1.OfficeBranch.CEBU,
            client_1.OfficeBranch.CALBAYOG
        ]),
        password: zod_1.z.string().min(8).refine((password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        }, {
            message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (@$!%*?&).'
        }),
    })
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        email: zod_1.z.string().email(),
        userType: zod_1.z.enum([client_1.UserType.ADMIN, client_1.UserType.EMPLOYEE]),
        permission: zod_1.z.enum([
            client_1.PermissionType.SUPER_ADMIN,
            client_1.PermissionType.SUPERVISOR,
            client_1.PermissionType.ACCOUNTING,
            client_1.PermissionType.RESERVATION
        ]).optional(),
        password: zod_1.z.string().min(8).refine((password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            return passwordRegex.test(password);
        }, {
            message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (@$!%*?&).'
        }).optional(),
    }),
    params: zod_1.z.object({
        id: zod_1.z.string()
    })
});
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string()
    })
});
