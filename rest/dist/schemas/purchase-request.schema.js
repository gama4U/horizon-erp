"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPurchaseRequestsSchema = exports.updatePurchaseRequestSchema = exports.createPurchaseRequestSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createPurchaseRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        supplierId: zod_1.z.string().min(1, {
            message: 'Supplier id is required'
        }),
        salesAgreementId: zod_1.z.string().optional(),
        disbursementType: zod_1.z.string().min(1, {
            message: 'Disbursement type is required'
        }),
        classification: zod_1.z.string().min(1, {
            message: 'Classification is required'
        }),
        classificationType: zod_1.z.string().min(1, {
            message: 'Classification type is required'
        }),
        currency: zod_1.z.enum([client_1.Currency.PHP, client_1.Currency.USD]),
        other: zod_1.z.string().optional(),
    })
});
exports.updatePurchaseRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        supplierId: zod_1.z.string().min(1, {
            message: 'Supplier id is required'
        }),
        salesAgreementId: zod_1.z.string().nullable(),
        disbursementType: zod_1.z.string().min(1, {
            message: 'Disbursement type is required'
        }),
        classification: zod_1.z.string().min(1, {
            message: 'Classification is required'
        }),
        classificationType: zod_1.z.string().min(1, {
            message: 'Classification type is required'
        }),
        other: zod_1.z.string().optional(),
    })
});
exports.findPurchaseRequestsSchema = zod_1.z.object({
    query: zod_1.z.object({
        skip: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid skip value'
        }).optional(),
        take: zod_1.z.string().refine(skip => !isNaN(Number(skip)), {
            message: 'Invalid take value'
        }).optional(),
        search: zod_1.z.string().optional(),
        branch: zod_1.z.string().optional(),
        type: zod_1.z.string().optional(),
        classification: zod_1.z.string().optional(),
    })
});
