"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseRequestItemSchema = exports.createPurchaseRequestItemSchema = void 0;
const zod_1 = require("zod");
exports.createPurchaseRequestItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        purchaseRequestOrderId: zod_1.z.string().min(1, {
            message: 'Purchase request order id is required'
        }),
        particulars: zod_1.z.array(zod_1.z.string().min(1, {
            message: 'Particular item should not be empty'
        })),
        quantity: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid quantity'
        }),
        unitPrice: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid unit price'
        }),
        total: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid total'
        }),
    })
});
exports.updatePurchaseRequestItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        particulars: zod_1.z.array(zod_1.z.string().min(1, {
            message: 'Particular item should not be empty'
        })),
        quantity: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid quantity'
        }),
        unitPrice: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid unit price'
        }),
        total: zod_1.z.number().refine(value => value > 0, {
            message: 'Invalid total'
        }),
    })
});
