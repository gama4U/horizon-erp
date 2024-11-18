"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientsSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.getClientsSchema = zod_1.z.object({
    query: zod_1.z.object({
        skip: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid skip value'
        }).optional(),
        take: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid take value'
        }).optional(),
        search: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
        isApproved: zod_1.z
            .string()
            .transform(val => val === 'true')
            .optional(),
        typeOfClient: zod_1.z.enum([client_1.ClientType.GROUP, client_1.ClientType.WALK_IN, client_1.ClientType.CORPORATE, client_1.ClientType.GOVERNMENT, client_1.ClientType.INDIVIDUAL]).optional(),
    })
});
