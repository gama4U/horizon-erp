import express, { Request, Response } from 'express';
import { createMemorandum, deleteMemorandum, fetchMemorandums, fetchMemorandumSummary, findMemorandumById, updateMemorandum, updateMemorandumApprover } from '../services/memorandum.service';
import { validate } from '../middlewares/validate.middleware';
import { getMemorandumsSchema } from '../schemas/memorandum.schema';
import { authorize } from '../middlewares/authorize.middleware';
import { UserType } from '@prisma/client';

const memorandumRouter = express.Router();

memorandumRouter.post('/', async (req: Request, res: Response) => {
  try {
    const memorandum = await createMemorandum(req.body)
    if (!memorandum) { throw new Error('Failed to create memorandum') }

    return res.status(200).json(memorandum);
  } catch (error) {
    res.status(500).json(error)
  }
});

memorandumRouter.get('/', validate(getMemorandumsSchema), async (req: Request, res: Response) => {
  try {

    const { skip, take, search, branch } = req.query;

    const filters = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search: search ? String(search) : undefined,
      branch: branch ? String(branch) : undefined,
    };

    const memorandums = await fetchMemorandums(filters);

    if (!memorandums) {
      throw new Error('Failed to get memorandums')
    }
    return res.status(200).json(memorandums);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

memorandumRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const memorandum = await findMemorandumById(id);
    if (!memorandum) {
      return res.status(404).json({ message: 'Memorandum not found' });
    }

    return res.status(200).json(memorandum);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})



memorandumRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const itinerary = await updateMemorandum({ id, ...req.body })
    if (!itinerary) { throw new Error('Failed to update memorandum') }
    res.status(200).json({ message: "Successfully updated memorandum" })
  } catch (error) {
    res.status(500).json(error)
  }
});

memorandumRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await deleteMemorandum(id)
    if (!deleted) { throw new Error('Failed to delete memorandum') }
    res.status(200).json({ message: "Successfully deleted memorandum" })
  } catch (error) {
    res.status(500).json(error)
  }
});

memorandumRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const memorandumId = req.params.id;
    const deleted = await deleteMemorandum(memorandumId);
    if (!deleted) {
      return res.status(404).json({ message: 'Memorandum not found' });
    }

    return res.status(200).json({
      message: 'Memorandum deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

memorandumRouter.post('/summary', async (req: Request, res: Response) => {

  try {
    const data = await fetchMemorandumSummary();
    if (!data) {
      return res.status(404).json({ message: 'Failed to fetch sales agreement data' });
    }
    return res.status(200).json(data);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

memorandumRouter.patch('/:id/approver', authorize([UserType.ADMIN]), async (req: Request, res: Response) => {
  try {
    const approverId = String(req.user?.id);
    const { id } = req.params;

    const updated = await updateMemorandumApprover({ id, approverId })
    if (!updated) {
      throw new Error("Failed to update memorandum approver");
    }

    return res.status(200).json({
      message: 'Approved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
})



export default memorandumRouter;
