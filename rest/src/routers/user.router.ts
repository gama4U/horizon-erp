import express, { Request, Response } from 'express';
import { createUserSchema, deleteUserSchema, getUsersSchema, updateUserSchema } from '../schemas/user.schema';
import { validate } from '../middlewares/validate.middleware';
import { createUser, deleteUser, findUserById, findUsers, getUserByEmail, updateUser } from '../services/user.service';
import bcrypt from 'bcrypt';
import { IFindUsers } from '../interfaces/user.interface';

const userRouter = express.Router();

const saltRounds = 15;

userRouter.post('/', validate(createUserSchema), async (req: Request, res: Response) => {
  try {
    const { password, ...data } = req.body;

    const foundUser = await getUserByEmail(data.email);

    if (foundUser) return res.status(400).json({
      message: 'Account already exists'
    });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const created = await createUser({ ...data, password: hashedPassword });
    if (!created) throw new Error('Failed to create user');

    res.status(200).json({
      message: 'User created successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.get('/', validate(getUsersSchema), async (req: Request, res: Response) => {
  try {
    const query = {
      skip: Number(req.query.skip),
      take: Number(req.query.take),
      search: req.query.search,
      branch: req.query.branch,
      type: req.query.type
    } as IFindUsers;

    const users = await findUsers(query);
    if (!users) throw new Error('Failed to get users');

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.put('/:id', validate(updateUserSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { password, ...data } = req.body;
    const hashedPassword = password && ({
      password: await bcrypt.hash(password, saltRounds)
    })
    const updated = await updateUser({
      id,
      ...data,
      ...hashedPassword,
    });
    if (!updated) throw new Error('Failed to update user');
    res.status(200).json({
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.delete('/:id', validate(deleteUserSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await deleteUser(id);
    if (!deleted) throw new Error('Failed to delete user');
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);
    if (!user) {
      throw new Error('Failed to get user')
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default userRouter;
