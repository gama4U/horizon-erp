import { ClientType } from "@prisma/client";
import { z } from "zod";

export const getClientsSchema = z.object({
  query: z.object({
    skip: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid skip value'
    }).optional(),
    take: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid take value'
    }).optional(),
    search: z.string().optional(),
    branch: z.string().optional(),
    isApproved: z
      .string()
      .transform(val => val === 'true')
      .optional(),
    typeOfClient: z.enum([ClientType.GROUP, ClientType.WALK_IN, ClientType.CORPORATE, ClientType.GOVERNMENT, ClientType.INDIVIDUAL]).optional(),
  })
});
