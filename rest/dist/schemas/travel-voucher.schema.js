"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTravelVoucherSchema = exports.createTravelVoucherSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createTravelVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum([client_1.TravelType.AIRLINES, client_1.TravelType.SHIPPING]),
        transactionId: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        shipping: zod_1.z.object({
            voyageNumber: zod_1.z.string(),
            dateOfTravel: zod_1.z.string(),
            name: zod_1.z.string(),
            origin: zod_1.z.string()
        }).optional(),
        airline: zod_1.z.object({
            name: zod_1.z.string(),
            code: zod_1.z.string(),
            origin: zod_1.z.string(),
            destination: zod_1.z.string(),
            etd: zod_1.z.string(),
            eta: zod_1.z.string(),
        }).optional()
    })
});
exports.updateTravelVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string(),
        type: zod_1.z.enum([client_1.TravelType.AIRLINES, client_1.TravelType.SHIPPING]),
        shipping: zod_1.z.object({
            id: zod_1.z.string(),
            voyageNumber: zod_1.z.string(),
            dateOfTravel: zod_1.z.string(),
            name: zod_1.z.string(),
            origin: zod_1.z.string()
        }).optional(),
        airline: zod_1.z.object({
            id: zod_1.z.string(),
            name: zod_1.z.string(),
            code: zod_1.z.string(),
            origin: zod_1.z.string(),
            destination: zod_1.z.string(),
            etd: zod_1.z.string(),
            eta: zod_1.z.string(),
        }).optional()
    })
});
