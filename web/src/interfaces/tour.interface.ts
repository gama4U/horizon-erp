export interface ITourVoucher {
  id: string;
  // tour: string;
  remarks?: string;
  // tourGuide: string;
  // tourContact: string;
  // driverName: string;
  // driverContact: string;
  itineraries: IItinerary[]
}

export interface IItinerary {
  id: string
  tourId?: string
  transportId?: string
  title: string
  description: string
  startDate: Date
  endDate: Date
}
