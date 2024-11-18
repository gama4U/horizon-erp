import { ITransaction } from "./transaction.interface";

enum TravelType {
  AIRLINES = "AIRLINES",
  SHIPPING = "SHIPPING"
}

export interface ITravelVoucher {
  id: string;
  transactionId?: string;       // Optional because it might be nullable
  transaction?: ITransaction;    // Optional relation
  type: TravelType;             // Assuming TravelType is an enum or a string
  airline?: IAirlines;          // Optional, assuming a voucher may not always be for airlines
  shipping?: Shipping;          // Optional, in case it's for shipping
  createdAt?: Date;             // Optional based on nullable DateTime
  updatedAt?: Date;             // Optional based on nullable DateTime
}



export interface ICreateTravelVoucher {
  transactionId: string;       // Optional because it might be nullable
  type: TravelType;             // Assuming TravelType is an enum or a string
}
export interface IUpdateTravelVoucher {
  id: string;
  type: TravelType;
}



export interface IAirlines {
  id: string;
  name: string;
  code: string;
  etd: Date;
  eta: Date;
  origin: string;
  travelId?: string;  // Optional because it's nullable in the schema
  travel?: ITravelVoucher;    // Optional because it's a nullable relation
  destination: string;
  createdAt?: Date;   // Optional because it's nullable in the schema
  updatedAt?: Date;   // Optional because it's nullable in the schema
}
export interface ICreateAirlines {
  name: string;
  code: string;
  etd: Date;
  eta: Date;
  origin: string;
  travelId: string;  // Optional because it's nullable in the schema
  destination: string;
}
export interface IUpdateAirlines {
  id: string;
  name: string;
  code: string;
  etd: Date;
  eta: Date;
  origin: string;
  destination: string;
}

export interface Shipping {
  id: string;
  name: string;
  voyageNumber: string;
  dateOfTravel: Date;
  origin: string;
  destination: string;
  travelId?: string;  // Optional because it's nullable in the schema
}
export interface ICreateShipping {
  name: string;
  voyageNumber: string;
  dateOfTravel: Date;
  origin: string;
  destination: string;
  travelId: string;
}
export interface IUpdateShipping {
  id: string;
  name: string;
  voyageNumber: string;
  dateOfTravel: Date;
  origin: string;
  destination: string;
}

