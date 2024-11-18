import { IItinerary } from "./tour.interface";

export interface ITransportVoucher {
  id: string

  driverName: string;
  driverContact: string;
  remarks?: string;
  vehiclePlateNumber: string
  serviceType: TransportServiceType
  vehicleType: VehicleType
  itineraries: IItinerary[]
}

export enum TransportServiceType {
  PUDO = "PUDO",
  WHOLE_DAY = "WHOLE_DAY",
  HALF_DAY = "HALF_DAY",
  MULTIPLE = "MULTIPLE"
}

export enum VehicleType {
  VAN = "VAN",
  SUV = "SUV",
  COASTER = "COASTER",
  SEDAN = "SEDAN",
  BUS = "BUS"
}
