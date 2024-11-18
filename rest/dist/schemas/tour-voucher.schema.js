"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTourVoucherSchema = exports.createTourVoucherSchema = void 0;
const zod_1 = require("zod");
exports.createTourVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        transactionId: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        tourGuide: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
        tourContact: zod_1.z.string(),
        driverName: zod_1.z.string(),
        driverContact: zod_1.z.string(),
    })
});
exports.updateTourVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        tourGuide: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
        tourContact: zod_1.z.string(),
        driverName: zod_1.z.string(),
        driverContact: zod_1.z.string(),
    })
});
