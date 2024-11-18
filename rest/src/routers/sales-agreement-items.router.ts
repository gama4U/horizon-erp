import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createSalesAgreementItemSchema, updateSalesAgreementItemSchema } from '../schemas/sales-agreement-item.schema';
import { createSalesAgreementItem, deleteSalesAgreementItem, updateSalesAgreementItem } from '../services/sales-agreement-item.service';

const salesAgreementItemRouter = express.Router();

salesAgreementItemRouter.post('/', validate(createSalesAgreementItemSchema), async(req: Request, res: Response) => {
  try {
    const created = await createSalesAgreementItem(req.body);
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

salesAgreementItemRouter.put('/:id', validate(updateSalesAgreementItemSchema), async(req: Request, res: Response) => {
  try {
    const salesAgreementItemId = req.params.id;

    const updated = await updateSalesAgreementItem({salesAgreementItemId, ...req.body});
    if (!updated) {
      throw new Error('Failed to update sales agreement item')
    }

    return res.status(200).json({
      message: 'Sales agreement item updated successfully'
    })

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

salesAgreementItemRouter.delete('/:id', async(req: Request, res: Response) => {
  try {
    const salesAgreementItemId = req.params.id;
    
    const deleted = await deleteSalesAgreementItem(salesAgreementItemId);
    if (!deleted) {
      throw new Error('Failed to delete sales agreement item')
    }

    return res.status(200).json({
      message: 'Sales agreement item deleted successfully'
    });

  } catch(error) {
    return res.status(500).json({message: 'Internal server error'});
  }
});

export default salesAgreementItemRouter;
