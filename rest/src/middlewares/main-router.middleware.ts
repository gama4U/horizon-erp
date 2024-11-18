import { User } from '@prisma/client';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const mainRouter = express.Router();

mainRouter.use((req: Request, res: Response, next: NextFunction) => {
  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized');
  }
  const token = req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  if(!process.env.JWT_PRIVATE_KEY) {
    throw new Error('Failed to get jwt private key')
  }
  jwt.verify(token, process.env.JWT_PRIVATE_KEY, (error, payload) => {
    if(error) {
      return res.status(401).send('Unauthorized');
    }
    req.user = payload as User;
    next();
  })
})

export default mainRouter;
