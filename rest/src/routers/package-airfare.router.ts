import express, { Request, Response } from 'express';
import { createPackageAirfare, deletePackageAirfare, updatePackageAirfare } from '../services/package-airfare.service';

const packageAirfareRouter = express.Router();

packageAirfareRouter.post('/', async (req: Request, res: Response) => {
  try {
    const created = await createPackageAirfare(req.body);
    if (!created) throw new Error('Failed to create package airfare');

    res.status(200).json({
      message: 'Updated successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

packageAirfareRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const updated = await updatePackageAirfare({id, ...req.body});
    if (!updated) throw new Error('Failed to update package airfare');

    res.status(200).json({
      message: 'Updated successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});


packageAirfareRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deleted = await deletePackageAirfare(id);
    if (!deleted) throw new Error('Failed to delete package airfare');

    res.status(200).json({
      message: 'Deleted successfully'
    });

  } catch (error) {
    res.status(500).json(error);
  }
});

export default packageAirfareRouter;
