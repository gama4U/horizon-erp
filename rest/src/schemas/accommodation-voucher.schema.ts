import { AccommodationType, TravelType } from "@prisma/client";
import { z } from "zod";

export const createAccommodationVoucherSchema = z.object({
  body:
    z.object({
      type: z.enum([AccommodationType.HOTEL, AccommodationType.AIRBNB, AccommodationType.RESORT, AccommodationType.OTHERS]),
      transactionId: z.string().min(1, {
        message: "Invalid ID"
      }),
      name: z.string(),
      hotelConfirmationNumber: z.string(),
      checkinDate: z.string(),
      checkoutDate: z.string(),
      numberOfNights: z.number().optional(),
      remarks: z.string().optional(),
    })
});
export const updateAccommodationVoucherSchema = z.object({
  body:
    z.object({
      type: z.enum([AccommodationType.HOTEL, AccommodationType.AIRBNB, AccommodationType.RESORT, AccommodationType.OTHERS]),
      id: z.string().min(1, {
        message: "Invalid ID"
      }),
      name: z.string(),
      hotelConfirmationNumber: z.string(),
      checkinDate: z.string(),
      checkoutDate: z.string(),
      remarks: z.string().optional(),
      numberOfNights: z.number().optional(),
      pax: z.number().optional(),
    })
});


