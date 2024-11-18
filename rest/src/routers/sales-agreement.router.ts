import express, { Request, Response } from 'express';
import { createSalesAgreementSchema, getSalesAgreementsSchema, updateSalesAgreementSchema } from '../schemas/sales-agreement.schema';
import { validate } from '../middlewares/validate.middleware';
import { createSalesAgreement, deleteSalesAgreementById, fetchSalesAgreementSummary, findSalesAgreementById, findSalesAgreements, updateSalesAgreement, updateSalesAgreementApprover } from '../services/sales-agreement.service';
import { ClientType, UserType } from '@prisma/client';
import { deleteSalesAgreementItems } from '../services/sales-agreement-item.service';
import { authorize } from '../middlewares/authorize.middleware';
import { findClientById } from '../services/client.service';

const salesAgreementRouter = express.Router();

salesAgreementRouter.post('/', validate(createSalesAgreementSchema), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const foundClient = await findClientById(req.body.clientId);
    if (!foundClient) {
      throw new Error('Failed to find client');
    }

    const created = await createSalesAgreement({
      creatorId: userId, 
      ...req.body, 
      officeBranch: foundClient.officeBranch 
    });
    if (!created) {
      throw new Error('Failed to create sales agreement')
    }

    return res.status(200).json({
      ...created,
      message: 'Sales agreement created successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

salesAgreementRouter.put('/:id', validate(updateSalesAgreementSchema), async (req: Request, res: Response) => {
  try {
    const salesAgreementItemId = req.params.id;

    const created = await updateSalesAgreement({ id: salesAgreementItemId, ...req.body });
    if (!created) {
      throw new Error('Failed to update sales agreement')
    }

    return res.status(200).json({
      ...created,
      message: 'Sales agreement update successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

salesAgreementRouter.get('/', validate(getSalesAgreementsSchema), async (req: Request, res: Response) => {
  try {
    const { skip, take, search, typeOfClient, branch } = req.query;

    const filters = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search: search ? String(search) : undefined,
      branch: branch ? String(branch) : undefined,
      typeOfClient: typeOfClient ? typeOfClient as ClientType : undefined,
    };

    const salesAgreements = await findSalesAgreements(filters);

    if (!salesAgreements) {
      throw new Error('Failed to get sales agreements')
    }

    return res.status(200).json(salesAgreements);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
});

salesAgreementRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const salesAgreementId = req.params.id;

    const salesAgreement = await findSalesAgreementById(salesAgreementId);
    if (!salesAgreement) {
      return res.status(404).json({ message: 'Sales agreement not found' });
    }

    return res.status(200).json(salesAgreement);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

salesAgreementRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const salesAgreementId = req.params.id;

    const deletedItems = await deleteSalesAgreementItems(salesAgreementId);
    if (!deletedItems) {
      throw new Error('Failed to delete sales agreement items');
    }

    const deleted = await deleteSalesAgreementById(salesAgreementId);
    if (!deleted) {
      return res.status(404).json({ message: 'Sales agreement not found' });
    }

    return res.status(200).json({
      message: 'Sales agreement deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})

salesAgreementRouter.post('/summary', async (req: Request, res: Response) => {
  try {
    const data = await fetchSalesAgreementSummary();
    if (!data) {
      return res.status(404).json({ message: 'Failed to fetch sales agreement data' });
    }
    return res.status(200).json(data);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

salesAgreementRouter.patch('/:id/approver', async (req: Request, res: Response) => {
  try {
    const approverId = String(req.user?.id);
    const id = req.params.id;

    const update = await updateSalesAgreementApprover({ id, approverId });
    if (!update) {
      throw new Error('Failed to approve sales agreement');
    }

    return res.status(200).json({
      message: 'Sales agreement approved successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

export default salesAgreementRouter;
