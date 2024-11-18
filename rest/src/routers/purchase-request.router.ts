import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { UserType } from '@prisma/client';
import { createPurchaseRequestSchema, findPurchaseRequestsSchema, updatePurchaseRequestSchema } from '../schemas/purchase-request.schema';
import { createPurchaseRequest, deletePurchaseRequestById, fetchPurchaseRequestSummary, findPurchaseRequestById, findPurchaseRequests, updatePurchaseRequest, updatePurchaseRequestOrderApprover } from '../services/purchase-request.service';
import { deletePurchaseRequestItems } from '../services/purchase-request-item.service';
import { authorize } from '../middlewares/authorize.middleware';
import { findSupplierById } from '../services/supplier.service';

const purchaseRequestRouter = express.Router();

purchaseRequestRouter.post('/', validate(createPurchaseRequestSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const foundSupplier = await findSupplierById(req.body.supplierId);
    if (!foundSupplier) {
      throw new Error('Failed to find supplier');
    }

    const created = await createPurchaseRequest({
      creatorId: userId,
      ...req.body,
      officeBranch: foundSupplier.officeBranch
    });
    if (!created) {
      throw new Error('Failed to create purchase request')
    }

    return res.status(200).json({
      ...created,
      message: 'Purchase request created successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

purchaseRequestRouter.put('/:id', validate(updatePurchaseRequestSchema), async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const created = await updatePurchaseRequest({ id, ...req.body });
    if (!created) {
      throw new Error('Failed to update purchase request')
    }

    return res.status(200).json({
      ...created,
      message: 'Purchase request updated successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

purchaseRequestRouter.get('/', validate(findPurchaseRequestsSchema), async (req: Request, res: Response) => {
  try {
    const { skip, take, search, category, branch, type, classification } = req.query;

    const filters = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search: search ? String(search) : undefined,
      category: category ? String(category) : undefined,
      branch: branch ? String(branch) : undefined,
      type: type ? String(type) : undefined,
      classification: classification ? String(classification) : undefined
    };


    const purchaseRequests = await findPurchaseRequests(filters);

    if (!purchaseRequests) {
      throw new Error('Failed to find purchase requests')
    }

    return res.status(200).json(purchaseRequests);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
});

purchaseRequestRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const purchaseRequest = await findPurchaseRequestById(id);
    if (!purchaseRequest) {
      return res.status(404).json({ message: 'Purchase request not found' });
    }

    return res.status(200).json(purchaseRequest);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

purchaseRequestRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deletedItems = await deletePurchaseRequestItems(id);
    if (!deletedItems) {
      throw new Error('Failed to delete purchase request items');
    }

    const deleted = await deletePurchaseRequestById(id);
    if (!deleted) {
      throw new Error('Failed to delete purchase request');
    }

    return res.status(200).json({
      message: 'Purchase request deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

purchaseRequestRouter.post('/summary', async (req: Request, res: Response) => {
  try {
    const data = await fetchPurchaseRequestSummary();
    if (!data) {
      return res.status(404).json({ message: 'Failed to fetch purchase request data' });
    }
    return res.status(200).json(data);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

purchaseRequestRouter.patch('/:id/approver', authorize([UserType.ADMIN]), async (req: Request, res: Response) => {
  try {
    const approverId = String(req.user?.id);
    const { id } = req.params;

    const updated = await updatePurchaseRequestOrderApprover({ id, approverId });
    if (!updated) {
      throw new Error('Failed to update purchase request approver');
    }

    return res.status(200).json({
      message: 'Purchase request approved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default purchaseRequestRouter;
