import { AxiosError } from "axios";
import api from "../../utils/api.util";

export type DocumentTransactionFilters = {
  [key in DocumentTransactionType]: boolean;
};

export enum DocumentTransactionType {
  TRANSMITTAL = "TRANSMITTAL",
  RETURN = "RETURN",
  RECIEVE = "RECIEVE",
}

export interface ICreateDocumentTransaction {
  preparedById: string
  clientId: string
  type: DocumentTransactionType
}


export interface ICreatedDocumentTransaction {
  id: string
  preparedById: string
}

export async function createDocumentTransaction(data: ICreateDocumentTransaction): Promise<ICreatedDocumentTransaction> {
  try {
    const response = await api.post('/api/v1/document-transactions', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export interface IUpdateDocumentTransaction {
  id: string
  documents?: string[]

  recievedById?: string
  transmittedById?: string
  returnedById?: string
  recievedByOutsider?: string
  recievedFromOutsider?: string
}

export async function updateDocumentTransaction(data: IUpdateDocumentTransaction) {
  try {
    const response = await api.put(`/api/v1/document-transactions/${data.id}`, data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deleteDocumentTransaction(id: string) {
  try {
    const response = await api.delete(`/api/v1/document-transactions/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function transmitDocument(id: string) {
  try {
    const response = await api.patch(`/api/v1/document-transactions/${id}/transmit`);
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}


