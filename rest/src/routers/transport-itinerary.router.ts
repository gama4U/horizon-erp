import express, { Request, Response } from 'express';
import { createTransportItinerary, deleteTransportItinerary, updateTransportItinerary } from '../services/tour-voucher.service';

const transportItineraryRouter = express.Router();

transportItineraryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const itinerary = await createTransportItinerary(req.body)
    if (!itinerary) { throw new Error('Failed to create itinerary') }
    res.status(200).json({ message: "Successfully created itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});


transportItineraryRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const itinerary = await updateTransportItinerary({ id, ...req.body })
    if (!itinerary) { throw new Error('Failed to update itinerary') }
    res.status(200).json({ message: "Successfully created itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});

transportItineraryRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await deleteTransportItinerary(id)
    if (!deleted) { throw new Error('Failed to delete itinerary') }
    res.status(200).json({ message: "Successfully deleted itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});


export default transportItineraryRouter;
