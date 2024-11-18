import express, { Request, Response } from 'express';
import { findUserById, updateUser, updateUserAvatar, updateUserPassword, updateUserSignature } from '../services/user.service';
import { validate } from '../middlewares/validate.middleware';
import { updateAvatarSchema, updateProfileSchema, updateSignatureSchema, updateUserPasswordSchema } from '../schemas/profile.schema';
import bcrypt from 'bcrypt';

const profileRouter = express.Router();

profileRouter.get('/', async(req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);

    const profile = await findUserById(userId);
    if (!profile) {
      return res.status(404).json({message: 'Profile not found'});
    }

    const {password, ...sanitizedProfile} = profile;
    
    return res.status(200).json(sanitizedProfile);

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

profileRouter.patch('/avatar', validate(updateAvatarSchema), async(req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const {avatar} = req.body;
    
    const updated = await updateUserAvatar({id: userId, avatar});
    if (!updated) {
      throw new Error('Failed to update user avatar');
    }
    
    return res.status(200).json({
      message: 'Avatar updated successfully'
    });

  } catch(error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

profileRouter.put('/', validate(updateProfileSchema), async(req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    
    const updated = await updateUser({id: userId, ...req.body});
    if (!updated) {
      throw new Error('Failed to update user profile');
    }
    
    return res.status(200).json({
      message: 'User profile updated successfully'
    });

  } catch(error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

profileRouter.put('/password', validate(updateUserPasswordSchema), async(req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const {currentPassword, password} = req.body;
    const saltRounds = 15;
    
    const foundUser = await findUserById(userId);
    if (!foundUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const correctPassword = await bcrypt.compare(currentPassword, foundUser.password);
    if (!correctPassword) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const updated = await updateUserPassword({
      id: userId,
      password: hashedPassword
    });
    if (!updated) {
      throw new Error('Failed to update user password');
    }
    
    return res.status(200).json({
      message: 'Password updated successfully'
      
    });

  } catch(error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

profileRouter.patch('/signature', validate(updateSignatureSchema), async(req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);
    const {signature} = req.body;
    
    const updated = await updateUserSignature({id: userId, signature});
    if (!updated) {
      throw new Error('Failed to update user signature');
    }
    
    return res.status(200).json({
      message: 'Signature updated successfully'
    });

  } catch(error) {
    return res.status(500).json({message: "Internal server error"});
  }
});

export default profileRouter;
