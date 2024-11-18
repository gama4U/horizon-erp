import { z } from "zod";

export const createSalesAgreementItemSchema = z.object({
  body: z.object({
    particulars: z.array(z.string().min(1, {
      message: 'Particular item should not be empty'
    })),
    quantity: z.number().refine(value => value > 0, {
      message: 'Invalid quantity'
    }),
    unitPrice: z.number().refine(value => value > 0, {
      message: 'Invalid unit price'
    }),
    total: z.number().refine(value => value > 0, {
      message: 'Invalid total'
    }),
    serviceFee: z.number().nonnegative().optional()
  })
});

export const updateSalesAgreementItemSchema = z.object({
  body: z.object({
    particulars: z.array(z.string().min(1, {
      message: 'Particular item should not be empty'
    })),
    quantity: z.number().refine(value => value > 0, {
      message: 'Invalid quantity'
    }),
    unitPrice: z.number().refine(value => value > 0, {
      message: 'Invalid unit price'
    }),
    total: z.number().refine(value => value > 0, {
      message: 'Invalid total'
    }),
    serviceFee: z.number().nonnegative().optional()
  })
});
