"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransportVoucherSchema = exports.createTransportVoucherSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createTransportVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        transactionId: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        driverName: zod_1.z.string(),
        driverContact: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
        vehiclePlateNumber: zod_1.z.string(),
        serviceType: zod_1.z.enum([client_1.TransportServiceType.PUDO, client_1.TransportServiceType.HALF_DAY, client_1.TransportServiceType.MULTIPLE, client_1.TransportServiceType.WHOLE_DAY]),
        vehicleType: zod_1.z.enum([client_1.VehicleType.BUS, client_1.VehicleType.SUV, client_1.VehicleType.VAN, client_1.VehicleType.SEDAN, client_1.VehicleType.COASTER])
    })
});
exports.updateTransportVoucherSchema = zod_1.z.object({
    body: zod_1.z.object({
        id: zod_1.z.string().min(1, {
            message: "Invalid ID"
        }),
        driverName: zod_1.z.string(),
        driverContact: zod_1.z.string(),
        remarks: zod_1.z.string().optional(),
        vehiclePlateNumber: zod_1.z.string(),
        serviceType: zod_1.z.enum([client_1.TransportServiceType.PUDO, client_1.TransportServiceType.HALF_DAY, client_1.TransportServiceType.MULTIPLE, client_1.TransportServiceType.WHOLE_DAY]),
        vehicleType: zod_1.z.enum([client_1.VehicleType.BUS, client_1.VehicleType.SUV, client_1.VehicleType.VAN, client_1.VehicleType.SEDAN, client_1.VehicleType.COASTER])
    })
});
