import { ClientType, Currency, OfficeBranch } from "@prisma/client";
import { z } from "zod";

export const createSalesAgreementSchema = z.object({
  body: z.object({
    clientId: z.string().min(1, {
      message: 'Client id is required'
    }),
    currency: z.enum([Currency.PHP, Currency.USD]),
  })
});

export const updateSalesAgreementSchema = z.object({
  body: z.object({
    clientId: z.string().min(1, {
      message: 'Client id is required'
    }),
    currency: z.enum([Currency.PHP, Currency.USD]),
  })
});

export const getSalesAgreementsSchema = z.object({
  query: z.object({
    skip: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid skip value'
    }).optional(),
    take: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid take value'
    }).optional(),
    search: z.string().optional(),
    branch: z.string().optional(),
    typeOfClient: z.enum([ClientType.GROUP, ClientType.WALK_IN, ClientType.CORPORATE, ClientType.GOVERNMENT, ClientType.INDIVIDUAL]).optional(),
  })
});
