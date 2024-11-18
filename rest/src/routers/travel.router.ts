import express, { Request, Response } from 'express';
import { createAirlines, createShipping, createTravelVoucher, deleteTravelVoucher, updateAirline, updateShipping, updateTravelVoucher } from '../services/travel-voucher.service';
import { validate } from '../middlewares/validate.middleware';
import { createTravelVoucherSchema, updateTravelVoucherSchema } from '../schemas/travel-voucher.schema';
import { TravelType } from '@prisma/client';

const travelVoucherRouter = express.Router();

travelVoucherRouter.post('/', validate(createTravelVoucherSchema), async (req: Request, res: Response) => {
  const { shipping, airline, ...data } = req.body;

  try {
    const travelVoucher = await createTravelVoucher(data);
    if (!travelVoucher) { throw new Error('Failed to create travel voucher') }

    if (data.type === TravelType.AIRLINES && airline) {
      const createdAirlines = await createAirlines({ travelId: travelVoucher.id, ...airline })
      if (!createdAirlines) { throw new Error('Failed to add airline') }

    }
    if (data.type === TravelType.SHIPPING && shipping) {
      const createdShipping = await createShipping({ travelId: travelVoucher.id, ...shipping })
      if (!createdShipping) { throw new Error('Failed to add shipping') }
    }
    res.status(200).json({ message: 'Successfully created travel voucher' });
  } catch (error) {
    res.status(500).json(error);
  }
});
travelVoucherRouter.put('/:id', validate(updateTravelVoucherSchema), async (req: Request, res: Response) => {
  const { id } = req.params
  const { shipping, airline, ...data } = req.body;

  try {
    const travelVoucher = await updateTravelVoucher(id, data);
    if (!travelVoucher) { throw new Error('Failed to update travel voucher') }

    if (data.type === TravelType.AIRLINES && airline) {
      const createdAirlines = await updateAirline(airline)
      if (!createdAirlines) { throw new Error('Failed to update airline') }

    }
    if (data.type === TravelType.SHIPPING && shipping) {
      const createdShipping = await updateShipping(shipping)
      if (!createdShipping) { throw new Error('Failed to update shipping') }
    }
    res.status(200).json({ message: 'Successfully updated travel voucher' });
  } catch (error) {
    res.status(500).json(error);
  }
});
travelVoucherRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const deleted = await deleteTravelVoucher(id);
    if (!deleted) { throw new Error('Failed to delete travel voucher') }
    res.status(200).json({ message: 'Successfully deleted travel voucher' });
  } catch (error) {
    res.status(500).json(error);
  }
});




export default travelVoucherRouter;
