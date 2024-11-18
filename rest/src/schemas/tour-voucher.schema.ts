import { z } from "zod";

export const createTourVoucherSchema = z.object({
  body:
    z.object({
      transactionId: z.string().min(1, {
        message: "Invalid ID"
      }),
    })
});
export const updateTourVoucherSchema = z.object({
  body:
    z.object({
      id: z.string().min(1, {
        message: "Invalid ID"
      }),
      remarks: z.string().optional(),
    })
});
