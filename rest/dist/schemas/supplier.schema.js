"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuppliersSchema = void 0;
const zod_1 = require("zod");
exports.getSuppliersSchema = zod_1.z.object({
    query: zod_1.z.object({
        skip: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid skip value'
        }).optional(),
        take: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid take value'
        }).optional(),
        search: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
        // category: z.string().optional(),
        isApproved: zod_1.z
            .string()
            .transform(val => val === 'true')
            .optional(),
    })
});
