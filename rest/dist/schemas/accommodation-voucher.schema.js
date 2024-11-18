"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAccommodationVoucherSchema = exports.createAccommodationVoucherSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createAccommodationVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum([client_1.AccommodationType.HOTEL, client_1.AccommodationType.AIRBNB, client_1.AccommodationType.RESORT, client_1.AccommodationType.OTHERS]),
        transactionId: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        name: zod_1.z.string(),
        hotelConfirmationNumber: zod_1.z.string(),
        checkinDate: zod_1.z.string(),
        checkoutDate: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
    })
});
exports.updateAccommodationVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        type: zod_1.z.enum([client_1.AccommodationType.HOTEL, client_1.AccommodationType.AIRBNB, client_1.AccommodationType.RESORT, client_1.AccommodationType.OTHERS]),
        id: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        name: zod_1.z.string(),
        hotelConfirmationNumber: zod_1.z.string(),
        checkinDate: zod_1.z.string(),
        checkoutDate: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
    })
});
