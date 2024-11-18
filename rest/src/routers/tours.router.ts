import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createTourVoucherSchema, updateTourVoucherSchema } from '../schemas/tour-voucher.schema';
import { createTourVoucher, deleteTourVoucher, updateTourVoucher } from '../services/tour-voucher.service';

const tourVoucherRouter = express.Router();

tourVoucherRouter.post('/', validate(createTourVoucherSchema), async (req: Request, res: Response) => {
  try {
    const tourVoucher = await createTourVoucher(req.body)
    if (!tourVoucher) { throw new Error('Failed to create tour voucher') }
    res.status(200).json({ message: "Successfully created tour voucher" })
  } catch (error) {
    res.status(500).json(error)
  }
});

tourVoucherRouter.put('/:id', validate(updateTourVoucherSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updated = await updateTourVoucher({ id, ...req.body })

    if (!updated) { throw new Error('Failed to update tour voucher') }
    res.status(200).json({ message: "Successfully updated tour voucher" })
  } catch (error) {
    res.status(500).json(error)
  }
});

tourVoucherRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await deleteTourVoucher(id)
    if (!deleted) throw new Error('Failed to delete tour voucher')

    return res.status(200).json(deleted)

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default tourVoucherRouter;
