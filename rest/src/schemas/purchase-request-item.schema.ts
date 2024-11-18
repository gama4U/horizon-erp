import { z } from "zod";

export const createPurchaseRequestItemSchema = z.object({
  body: z.object({
    purchaseRequestOrderId: z.string().min(1, {
      message: 'Purchase request order id is required'
    }),
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
  })
});

export const updatePurchaseRequestItemSchema = z.object({
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
  })
});
