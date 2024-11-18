import express, { Request, Response } from 'express';
import { updateTourItinerary, createTourItinerary, deleteTourItinerary } from '../services/tour-voucher.service';

const tourItineraryRouter = express.Router();

tourItineraryRouter.post('/', async (req: Request, res: Response) => {
  try {
    const itinerary = await createTourItinerary(req.body)
    if (!itinerary) { throw new Error('Failed to create itinerary') }
    res.status(200).json({ message: "Successfully created itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});


tourItineraryRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const itinerary = await updateTourItinerary({ id, ...req.body })
    if (!itinerary) { throw new Error('Failed to update itinerary') }
    res.status(200).json({ message: "Successfully created itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});

tourItineraryRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await deleteTourItinerary(id)
    if (!deleted) { throw new Error('Failed to delete tour itinerary') }
    res.status(200).json({ message: "Successfully deleted itinerary" })
  } catch (error) {
    res.status(500).json(error)
  }
});

export default tourItineraryRouter;
