import { UserType } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const authorize = (authorizedUser: UserType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!req.user) {
      throw new Error('Empty user data');
    }
    const role  = req.user.userType;
    if(!authorizedUser.includes(role)) {
      return res.status(403).send('Forbidden');
    }
    next();
  }
}
