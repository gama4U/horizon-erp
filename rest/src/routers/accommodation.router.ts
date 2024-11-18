import express, { Request, Response } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { createAccommodationVoucherSchema, updateAccommodationVoucherSchema } from '../schemas/accommodation-voucher.schema';
import { createAccommodationVoucher, createRoomAccommodation, deleteAccommodationVoucher, deleteRoomAccommodation, updateAccommodationVoucher, updateRoomAccommodation } from '../services/accommodation-voucher.service';

const accommodationVoucherRouter = express.Router();

accommodationVoucherRouter.post('/', validate(createAccommodationVoucherSchema), async (req: Request, res: Response) => {
  try {
    const accommodationVoucher = await createAccommodationVoucher(req.body)

    if (!accommodationVoucher) { throw new Error('Failed to create accommodation voucher') }
    res.status(200).json({ message: "Successfully created accommodation voucher" })
  } catch (error) {
    res.status(500).json(error);
  }
});

accommodationVoucherRouter.post('/:id/room', async (req: Request, res: Response) => {

  const { id } = req.params
  try {
    const accommodationVoucher = await createRoomAccommodation(id, req.body)

    if (!accommodationVoucher) { throw new Error('Failed to create accommodation room') }
    res.status(200).json({ message: "Successfully created accommodation room" })
  } catch (error) {
    res.status(500).json(error);
  }
});

accommodationVoucherRouter.put('/:id/room/:roomId', async (req: Request, res: Response) => {

  const { roomId } = req.params
  try {
    const accommodationVoucher = await updateRoomAccommodation({
      id: roomId,
      ...req.body
    })

    if (!accommodationVoucher) { throw new Error('Failed to update accommodation room') }
    res.status(200).json({ message: "Successfully updated accommodation room" })
  } catch (error) {
    res.status(500).json(error);
  }
});


accommodationVoucherRouter.put('/:id', validate(updateAccommodationVoucherSchema), async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const accommodationVoucher = await updateAccommodationVoucher(id, req.body)

    if (!accommodationVoucher) { throw new Error('Failed to update accommodation voucher') }
    res.status(200).json({ message: "Successfully updated accommodation voucher" })
  } catch (error) {
    res.status(500).json(error);
  }
});

accommodationVoucherRouter.delete('/:id/room/:roomId', async (req: Request, res: Response) => {
  const { roomId } = req.params
  try {
    const accommodationVoucher = await deleteRoomAccommodation(roomId)

    if (!accommodationVoucher) { throw new Error('Failed to delete accommodation voucher') }
    res.status(200).json({ message: "Successfully deleted accommodation voucher" })
  } catch (error) {
    res.status(500).json(error);
  }
});

export default accommodationVoucherRouter;
