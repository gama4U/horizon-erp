
export interface IAccommodationVoucher {
  id: string;
  transactionId: string;
  transaction?: any;
  name: string;
  type: AccommodationType;
  checkinDate: Date;
  checkoutDate: Date;
  numberOfNights: number;
  pax: number;
  hotelConfirmationNumber: string;
  rooms: IRoomAccommodation[]
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRoomAccommodation {
  id: string
  childrenCount: number
  adultCount: number
  infantCount: number
  seniorCount: number

}


export enum AccommodationType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  AIRBNB = 'AIRBNB',
  OTHERS = 'OTHERS',
}

export interface IAddAccommodation {
  transactionId: string;
  name: string;
  type: AccommodationType;
  checkinDate: Date;
  checkoutDate: Date;
  hotelConfirmationNumber: string;
  remarks?: string;
}
