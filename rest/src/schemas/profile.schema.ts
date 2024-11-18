import { z } from "zod";

export const updateAvatarSchema = z.object({
  body: z.object({
    avatar: z.string(),
  })
});


export const updateSignatureSchema = z.object({
  body: z.object({
    signature: z.string()
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string()
    .trim().min(1, { 
      message: "First name is required" 
    }),
    lastName: z.string()
      .trim().min(1, {
        message: "Last name is required"
      }),
    email: z.string()
      .email({ message: "Invalid email address" }),
  })
})


export const updateUserPasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string()
    .trim().min(1, { 
      message: "Current password is required" 
    }),
    password: z.string()
      .trim().min(8, { 
        message: "Password must be at least 8 characters."
      })
      .refine(password => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
      }, {
        message: 'Password must have uppercase, lowercase, number, and special characters (@$!%*?&).'
      }),
  })
})