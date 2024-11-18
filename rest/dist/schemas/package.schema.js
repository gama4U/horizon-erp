"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageSchema = exports.createPackageSchema = exports.getPackagesSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.getPackagesSchema = zod_1.z.object({
    query: zod_1.z.object({
        skip: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid skip value'
        }).optional(),
        take: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid take value'
        }).optional(),
        search: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
    })
});
exports.createPackageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1, {
            message: "Name is required"
        }),
        inclusions: zod_1.z.array(zod_1.z.string().trim().min(1, {
            message: "Inclusion item must not be empty"
        })).refine(items => items.length > 0, {
            message: 'Please add at least one inclusion'
        }),
        exclusions: zod_1.z.array(zod_1.z.string().trim().min(1, {
            message: "Exclusion item must not be empty"
        })).refine(items => items.length > 0, {
            message: 'Please add at least one exclusion'
        }),
        remarks: zod_1.z.string().trim().min(1, {
            message: "Remarks is required"
        }),
        officeBranch: zod_1.z.enum([
            client_1.OfficeBranch.CEBU,
            client_1.OfficeBranch.CALBAYOG
        ]),
    })
});
exports.updatePackageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().trim().min(1, {
            message: "Name is required"
        }),
        inclusions: zod_1.z.array(zod_1.z.string().trim().min(1, {
            message: "Inclusion item must not be empty"
        })).refine(items => items.length > 0, {
            message: 'Please add at least one inclusion'
        }),
        exclusions: zod_1.z.array(zod_1.z.string().trim().min(1, {
            message: "Exclusion item must not be empty"
        })).refine(items => items.length > 0, {
            message: 'Please add at least one exclusion'
        }),
        remarks: zod_1.z.string().trim().min(1, {
            message: "Remarks is required"
        }),
    })
});
