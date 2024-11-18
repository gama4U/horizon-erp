import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export function validate (schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error) {
      if(error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message.toLowerCase()}`,
        }));
        res.status(400).json({
          message: errorMessages[0].message,
        });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
      })
    }
  }
}
