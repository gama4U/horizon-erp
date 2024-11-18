import { OfficeBranch } from "@prisma/client";
import { z } from "zod";

export const getPackagesSchema = z.object({
  query: z.object({
    skip: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid skip value'
    }).optional(),
    take: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid take value'
    }).optional(),
    search: z.string().optional(),
    branch: z.string().optional(),
  })
});

export const createPackageSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, {
      message: "Name is required"
    }),
    inclusions: z.array(
      z.string().trim().min(1, {
        message: "Inclusion item must not be empty"
      })
    ).refine(items => items.length > 0, {
      message: 'Please add at least one inclusion'
    }),
    exclusions: z.array(
      z.string().trim().min(1, {
        message: "Exclusion item must not be empty"
      })
    ).refine(items => items.length > 0, {
      message: 'Please add at least one exclusion'
    }),
    remarks: z.string().trim().min(1, {
      message: "Remarks is required"
    }),
    officeBranch: z.enum([
      OfficeBranch.CEBU,
      OfficeBranch.CALBAYOG
    ]),
  })
});


export const updatePackageSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, {
      message: "Name is required"
    }),
    inclusions: z.array(
      z.string().trim().min(1, {
        message: "Inclusion item must not be empty"
      })
    ).refine(items => items.length > 0, {
      message: 'Please add at least one inclusion'
    }),
    exclusions: z.array(
      z.string().trim().min(1, {
        message: "Exclusion item must not be empty"
      })
    ).refine(items => items.length > 0, {
      message: 'Please add at least one exclusion'
    }),
    remarks: z.string().trim().min(1, {
      message: "Remarks is required"
    }),
  })
});

