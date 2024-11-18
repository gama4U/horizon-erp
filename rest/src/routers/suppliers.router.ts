import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { getSuppliersSchema } from '../schemas/supplier.schema';
import { createSupplier, deleteSupplier, fetchSuppliers, fetchSupplierSummary, updateSupplier, updateSupplierApprover } from '../services/supplier.service';
import { authorize } from '../middlewares/authorize.middleware';
import { UserType } from '@prisma/client';

const supplierRouter = express.Router();

supplierRouter.post('/', async (req: Request, res: Response) => {
  try {

    const created = await createSupplier(req.body)
    if (!created) throw new Error('Failed to create supplier');

    return res.status(200).json(created);

  } catch (error) {
    res.status(500).json(error);
  }
});

supplierRouter.get('/', validate(getSuppliersSchema), async (req: Request, res: Response) => {
  try {
    const { skip, take, search, category, branch, isApproved } = req.query;
    const filters = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search: search ? String(search) : undefined,
      // category: category ? String(category) : undefined,
      branch: branch ? String(branch) : undefined,
      isApproved: isApproved === 'true' ? true : isApproved === 'false' ? false : undefined,
    };

    const clients = await fetchSuppliers(filters);

    if (!clients) {
      throw new Error('Failed to get suppliers')
    }
    return res.status(200).json(clients);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
});

supplierRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await updateSupplier(id, req.body)
    if (!updated) throw new Error('Failed to update supplier');

    return res.status(200).json(updated);

  } catch (error) {
    res.status(500).json(error);
  }
});

supplierRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await deleteSupplier(id);
    if (!deleted) {
      throw new Error('Failed to delete supplier');
    }

    return res.status(200).json({
      message: 'Supplier deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
})

supplierRouter.patch('/:id/approver', authorize([UserType.ADMIN]), async (req: Request, res: Response) => {
  try {
    const approverId = String(req.user?.id);
    const id = req.params.id;

    const update = await updateSupplierApprover({ id, approverId });
    if (!update) {
      throw new Error('Failed to approve supplier');
    }

    return res.status(200).json({
      message: 'Supplier approved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

supplierRouter.post('/summary', async (req: Request, res: Response) => {
  const { startMonth, endMonth } = req.body;

  if (
    startMonth < 1 || startMonth > 12 ||
    endMonth < 1 || endMonth > 12 ||
    (startMonth > endMonth && !(startMonth === 12 && endMonth === 1))
  ) {
    return res.status(400).json({ message: 'Invalid month range' });
  }

  try {
    const data = await fetchSupplierSummary(startMonth, endMonth);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No suppliers data found for the selected range' });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching suppliers summary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



export default supplierRouter;
