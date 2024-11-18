import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createPurchaseRequestItemSchema, updatePurchaseRequestItemSchema } from '../schemas/purchase-request-item.schema';
import { createPurchaseRequestItem, deletePurchaseRequestItem, updatePurchaseRequestItem } from '../services/purchase-request-item.service';

const purchaseRequestItemRouter = express.Router();

purchaseRequestItemRouter.post('/', validate(createPurchaseRequestItemSchema), async(req: Request, res: Response) => {
  try {
    const created = await createPurchaseRequestItem(req.body);
    if (!created) {
      throw new Error('Failed to created sales agreement item')
    }
    return res.status(200).json({
      message: 'Sales agreement item created successfully'
    })
  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

purchaseRequestItemRouter.put('/:id', validate(updatePurchaseRequestItemSchema), async(req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const updated = await updatePurchaseRequestItem({id, ...req.body});
    if (!updated) {
      throw new Error('Failed to update purchase request item')
    }

    return res.status(200).json({
      message: 'Purchase request item updated successfully'
    })

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

purchaseRequestItemRouter.delete('/:id', async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const deleted = await deletePurchaseRequestItem(id);
    if (!deleted) {
      throw new Error('Failed to delete purchase request item')
    }

    return res.status(200).json({
      message: 'Purchase request item deleted successfully'
    });

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

export default purchaseRequestItemRouter;
