import { TravelType } from "@prisma/client";
import { z } from "zod";

export const createTravelVoucherSchema = z.object({
  body:
    z.object({
      type: z.enum([TravelType.AIRLINES, TravelType.SHIPPING]),
      transactionId: z.string().min(1, {
        message: "Invalid ID"
      }),
      shipping: z.object({
        voyageNumber: z.string(),
        dateOfTravel: z.string(),
        name: z.string(),
        origin: z.string()
      }).optional(),
      airline: z.object({
        name: z.string(),
        code: z.string(),
        origin: z.string(),
        destination: z.string(),
        etd: z.string(),
        eta: z.string(),
      }).optional()
    })
});
export const updateTravelVoucherSchema = z.object({
  body:
    z.object({
      id: z.string(),
      type: z.enum([TravelType.AIRLINES, TravelType.SHIPPING]),
      shipping: z.object({
        id: z.string(),
        voyageNumber: z.string(),
        dateOfTravel: z.string(),
        name: z.string(),
        origin: z.string()
      }).optional(),
      airline: z.object({
        id: z.string(),
        name: z.string(),
        code: z.string(),
        origin: z.string(),
        destination: z.string(),
        etd: z.string(),
        eta: z.string(),
      }).optional()
    })
});


