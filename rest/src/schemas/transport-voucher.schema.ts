import { TransportServiceType, VehicleType } from "@prisma/client";
import { z } from "zod";


export const createTransportVoucherSchema = z.object({
  body:
    z.object({
      transactionId: z.string().min(1, {
        message: "Invalid ID"
      }),
      driverName: z.string(),
      driverContact: z.string(),
      remarks: z.string().optional(),
      vehiclePlateNumber: z.string(),
      serviceType: z.enum([TransportServiceType.PUDO, TransportServiceType.HALF_DAY, TransportServiceType.MULTIPLE, TransportServiceType.WHOLE_DAY]),
      vehicleType: z.enum([VehicleType.BUS, VehicleType.SUV, VehicleType.VAN, VehicleType.SEDAN, VehicleType.COASTER])
    })
});
export const updateTransportVoucherSchema = z.object({
  body:
    z.object({
      id: z.string().min(1, {
        message: "Invalid ID"
      }),
      driverName: z.string(),
      driverContact: z.string(),
      remarks: z.string().optional(),
      vehiclePlateNumber: z.string(),
      serviceType: z.enum([TransportServiceType.PUDO, TransportServiceType.HALF_DAY, TransportServiceType.MULTIPLE, TransportServiceType.WHOLE_DAY]),
      vehicleType: z.enum([VehicleType.BUS, VehicleType.SUV, VehicleType.VAN, VehicleType.SEDAN, VehicleType.COASTER])
    })
});
