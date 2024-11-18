import { AxiosError } from "axios";
import api from "../../utils/api.util";

export interface ICreateTourItinerary {
  tourId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface IUpdateTourItinerary {
  id: string
  title: string
  description: string
  startDate: Date;
  endDate: Date;
}
export interface ICreateTransportItinerary {
  transportId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export interface IUpdateTransportItinerary {
  id: string
  title: string
  description: string
  startDate: Date;
  endDate: Date;
}
export async function createTourItinerary(payload: ICreateTourItinerary) {
  try {
    const response = await api.post('/api/v1/tour-itineraries/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function updateTourItinerary(payload: IUpdateTourItinerary) {
  try {
    const response = await api.put(`/api/v1/tour-itineraries/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function deleteTourItinerary(id: string) {
  try {
    const response = await api.delete(`/api/v1/tour-itineraries/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function createTransportItinerary(payload: ICreateTransportItinerary) {
  try {
    const response = await api.post('/api/v1/transport-itineraries/', payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function updateTransportItinerary(payload: IUpdateTransportItinerary) {
  try {
    const response = await api.put(`/api/v1/transport-itineraries/${payload.id}`, payload)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
export async function deleteTransportItinerary(id: string) {
  try {
    const response = await api.delete(`/api/v1/transport-itineraries/${id}`)
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

