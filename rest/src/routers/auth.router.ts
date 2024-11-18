import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getUserByEmail } from '../services/user.service';
import { validate } from '../middlewares/validate.middleware';
import { signInSchema } from '../schemas/auth.schema';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/sign-in', validate(signInSchema), async(req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    const secretKey = process.env.JWT_PRIVATE_KEY;

    if(!secretKey) throw new Error('Missing jwt private key');

    const user = await getUserByEmail(email);
    if(!user) return res.status(400).json({
      message: 'Account does not exist'
    });

    const { password: hashPassword, ...userData} = user;

    const verified = await bcrypt.compare(password, hashPassword);
    if(!verified) return res.status(400).json({
      message: 'Incorrect password'
    });

    jwt.sign(userData, secretKey, { algorithm: 'HS256', expiresIn: '12h' }, 
      function(error, token) {
        if(error) throw new Error('JWT sign error');
        res.status(200).json({ 
          token,
          user: userData
        });
      }
    );

  } catch(error) {
    res.status(500).json(error);
  }
});

export default authRouter;
