import { z } from "zod";

export enum TransactionTypeFilters {
  TRAVEL = "TRAVEL",
  ACCOMMODATION = "ACCOMMODATION",
  TOUR = "TOUR",
  TRANSPORTATION = "TRANSPORTATION",
}

export const getTransactionsSchema = z.object({
  query: z.object({
    skip: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid skip value'
    }).optional(),
    take: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid take value'
    }).optional(),
    search: z.string().optional(),
    // filters: z.enum([TransactionTypeFilters.TOUR, TransactionTypeFilters.TRAVEL, TransactionTypeFilters.ACCOMMODATION, TransactionTypeFilters.TRANSPORTATION]).optional().array()
  })
});
