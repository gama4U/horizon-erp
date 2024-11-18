import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { ICreatedTransaction } from "../../interfaces/transaction.interface";
import { TravelVoucherType } from "../../interfaces/travel.interface";
import { TransportServiceType, VehicleType } from "../../interfaces/transport.interface";

export interface ICreateTransaction {
  id: string
  creatorId: string
  branch: string
}
export async function createTransaction(data: ICreateTransaction): Promise<ICreatedTransaction> {
  try {
    const response = await api.post('/api/v1/transactions', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function deleteTransaction(id: string) {
  try {
    const response = await api.delete(`/api/v1/transactions/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export interface ICreateAirline {
  name: string;
  code: string;
  etd: Date;
  eta: Date;
  origin: string;
  destination: string;
}
export interface ICreateShipping {
  name: string;
  voyageNumber: string;
  origin: string;
  destination: string;
  dateOfTravel: Date;
}

export interface ICreateTravelVoucher {
  transactionId: string;
  type?: TravelVoucherType;
  airline?: ICreateAirline;
  shipping?: ICreateShipping
}

export async function createTravelVoucher(payload: ICreateTravelVoucher) {
  try {
    const response = await api.post('/api/v1/travel-vouchers/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export enum AccommodationType {
  HOTEL = 'HOTEL',
  RESORT = 'RESORT',
  AIRBNB = 'AIRBNB',
  OTHERS = 'OTHERS',
}

export interface ICreateAccommodationVoucher {
  transactionId: string;
  name: string;
  type: AccommodationType;
  checkinDate: Date;
  checkoutDate: Date;
  hotelConfirmationNumber: string;
  remarks?: string;
}

export async function createAccommodationVoucher(payload: ICreateAccommodationVoucher) {
  try {
    const response = await api.post('/api/v1/accommodation-vouchers/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export interface ICreateTourVoucher {
  transactionId: string
  remarks?: string
}

export async function createTourVoucher(payload: ICreateTourVoucher) {
  try {
    const response = await api.post('/api/v1/tour-vouchers/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export interface IUpdateTransaction {
  id: string
  salesAgreementId?: string
  purchaseOrderId?: string
}

export async function updateTransaction(payload: IUpdateTransaction) {
  try {
    const response = await api.put(`/api/v1/transactions/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export interface IUpdateAirline {
  id: string;
  name: string;
  code: string;
  etd: Date;
  eta: Date;
  origin: string;
  destination: string;
}
export interface IUpdateShipping {
  id: string;
  name: string;
  voyageNumber: string;
  origin: string;
  destination: string;
  dateOfTravel: Date;
}

export interface IUpdateTravelVoucher {
  id: string;
  type: TravelVoucherType;
  airline?: IUpdateAirline;
  shipping?: IUpdateShipping
}

export async function updateTravelVoucher(payload: IUpdateTravelVoucher) {
  try {
    const response = await api.put(`/api/v1/travel-vouchers/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function deleteTravelVoucher(id: string) {
  try {
    const response = await api.delete(`/api/v1/travel-vouchers/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export interface IUpdateAccommodationVoucher {
  id: string;
  name: string;
  type: AccommodationType;
  checkinDate: Date;
  checkoutDate: Date;
  hotelConfirmationNumber: string;
  remarks?: string;
}
export async function updateAccommodationVoucher(payload: IUpdateAccommodationVoucher) {
  try {
    const response = await api.put(`/api/v1/accommodation-vouchers/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function deleteAccommodationVoucher(id: string) {
  try {
    const response = await api.delete(`/api/v1/accommodation-vouchers/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}


export interface IUpdateTourVoucher {
  id: string
  remarks?: string
}
export interface ICreateTransportVoucher {
  transactionId: string
  driverName: string
  driverContact: string
  remarks?: string
  vehiclePlateNumber: string
  serviceType: TransportServiceType
  vehicleType: VehicleType
}
export interface IUpdateTransportVoucher {
  id: string
  driverName: string
  driverContact: string
  remarks?: string
  vehiclePlateNumber: string
  serviceType: TransportServiceType
  vehicleType: VehicleType
}

export async function createTransportVoucher(payload: ICreateTransportVoucher) {
  try {
    const response = await api.post('/api/v1/transport-vouchers/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function updateTransportVoucher(payload: IUpdateTransportVoucher) {
  try {
    const response = await api.put(`/api/v1/transport-vouchers/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function deleteTransportVoucher(id: string) {
  try {
    const response = await api.delete(`/api/v1/transport-vouchers/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function updateTourVoucher(payload: IUpdateTourVoucher) {
  try {
    const response = await api.put(`/api/v1/tour-vouchers/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function deleteTourVoucher(id: string) {
  try {
    const response = await api.delete(`/api/v1/tour-vouchers/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function approveTransaction(id: string) {
  try {
    const response = await api.patch(`/api/v1/transactions/${id}/approver`);
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

