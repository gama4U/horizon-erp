import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { getDocumentTransactionSchema } from '../schemas/document-transaction.schema';
import { createDocumentTransaction, deleteDocumentTransaction, fetchDocumentTransactions, fetchDocumentTransactionsSummary, findDocumentTransactionById, transmitDocument, updateDocumentTransaction } from '../services/document-transaction.service';
import { findClientById } from '../services/client.service';

const documentTransactionRouter = express.Router();

documentTransactionRouter.post('/', async (req: Request, res: Response) => {
  try {

    const foundClient = await findClientById(req.body.clientId);
    const created = await createDocumentTransaction(req.body, String(foundClient?.officeBranch))
    if (!created) { throw new Error('Failed to create  document transaction') }

    return res.status(200).json(created);
  } catch (error) {
    res.status(500).json(error)
  }
});


documentTransactionRouter.get('/', validate(getDocumentTransactionSchema), async (req: Request, res: Response) => {
  try {
    const { skip, take, search, RECIEVE, TRANSMITTAL, RETURN, branch } = req.query;

    const filters = {
      skip: skip ? Number(skip) : undefined,
      take: take ? Number(take) : undefined,
      search: search ? String(search) : undefined,
      branch: branch ? String(branch) : undefined,
      RECIEVE: RECIEVE === 'true',
      TRANSMITTAL: TRANSMITTAL === 'true',
      RETURN: RETURN === 'true',
    };

    const documentTransactions = await fetchDocumentTransactions(filters);

    if (!documentTransactions) {
      throw new Error('Failed to get document transactions');
    }
    return res.status(200).json(documentTransactions);
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
});

documentTransactionRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const documentTransaction = await findDocumentTransactionById(id);
    if (!documentTransaction) {
      return res.status(404).json({ message: 'Document transaction not found' });
    }

    return res.status(200).json(documentTransaction);

  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
})



documentTransactionRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await updateDocumentTransaction({ id, ...req.body })
    if (!updated) { throw new Error('Failed to update document transaction') }
    res.status(200).json({ message: "Successfully updated document transaction" })
  } catch (error) {
    res.status(500).json(error)
  }
});

documentTransactionRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await deleteDocumentTransaction(id)
    if (!deleted) { throw new Error('Failed to delete document transaction') }
    res.status(200).json({ message: "Successfully deleted document transaction" })
  } catch (error) {
    res.status(500).json(error)
  }
});
documentTransactionRouter.patch('/:id/transmit', async (req: Request, res: Response) => {
  try {
    const transmittedById = String(req.user?.id);
    const { id } = req.params;

    const updated = await transmitDocument({ id, transmittedById })
    if (!updated) {
      throw new Error("Failed to transmit document transaction");
    }

    return res.status(200).json({
      message: 'Transmitted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: "Internal server error"
    })
  }
})
documentTransactionRouter.post('/summary', async (req: Request, res: Response) => {

  try {
    const data = await fetchDocumentTransactionsSummary();
    if (!data) {
      return res.status(404).json({ message: 'Failed to fetch document transactions data' });
    }
    return res.status(200).json(data);
  }
  catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});




export default documentTransactionRouter;
