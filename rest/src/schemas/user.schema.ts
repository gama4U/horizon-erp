import { OfficeBranch, PermissionType, UserType } from "@prisma/client";
import { z } from "zod";

export const getUsersSchema = z.object({
  query: z.object({
    skip: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid skip value'
    }).optional(),
    take: z.string().refine(skip => !isNaN(Number(skip)), {
      message: 'Invalid take value'
    }).optional(),
    search: z.string().optional(),
    branch: z.string().optional(),
    type: z.enum([UserType.ADMIN, UserType.EMPLOYEE]).optional()
  })
});

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    userType: z.enum([
      UserType.ADMIN,
      UserType.EMPLOYEE,
    ]),
    permission: z.enum([
      PermissionType.SUPER_ADMIN,
      PermissionType.SUPERVISOR,
      PermissionType.ACCOUNTING,
      PermissionType.RESERVATION
    ]),
    officeBranch: z.enum([
      OfficeBranch.CEBU,
      OfficeBranch.CALBAYOG
    ]),
    password: z.string().min(8).refine((password: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    }, {
      message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (@$!%*?&).'
    }),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    userType: z.enum([UserType.ADMIN, UserType.EMPLOYEE]),
    permission: z.enum([
      PermissionType.SUPER_ADMIN,
      PermissionType.SUPERVISOR,
      PermissionType.ACCOUNTING,
      PermissionType.RESERVATION
    ]).optional(),
    password: z.string().min(8).refine((password: string) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    }, {
      message: 'Must contain at least 1 uppercase letter, 1 lowercase letter, 1 digit, and 1 special character (@$!%*?&).'
    }).optional(),
  }),
  params: z.object({
    id: z.string()
  })
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string()
  })
});
