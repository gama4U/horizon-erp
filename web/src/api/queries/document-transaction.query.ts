import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IUser } from "@/interfaces/user.interface";
import { IClient } from "../mutations/client.mutation";
import { DocumentTransactionType } from "../mutations/document-transaction.mutation";

export interface IFetchdDocumentTransactions {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string | null;
  TRANSMITTAL?: boolean;
  RETURN?: boolean;
  RECIEVE?: boolean;
}

export interface IDocumentTransaction {
  id: string
  dtsNumber: string
  type: DocumentTransactionType
  documents: string[]
  preparedBy: IUser
  recievedBy: IUser
  transmittedBy: IUser
  returnedBy: IUser
  client: IClient
  recievedByOutsider: string
  recievedFromOutsider: string

  createdAt: Date
  updatedAt: Date
}

interface IDocumentTransactions {
  documentTransactionData: IDocumentTransaction[]
  total: number
}

export async function fetchDocumentTransactions({ ...params }: IFetchdDocumentTransactions): Promise<IDocumentTransactions> {
  try {
    const response = await api.get('/api/v1/document-transactions', {
      params: {
        ...params,
      }
    });
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function fetchDocumentTransaction(id: string): Promise<IDocumentTransaction> {
  try {
    const response = await api.get(`/api/v1/document-transactions/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

interface IDocumentTransactionsSummary {
  total: number
  since7days: number
  rate: number
  calbayogCount: number
  cebuCount: number
}
export async function fetchDtsSummary(): Promise<IDocumentTransactionsSummary> {
  try {
    const response = await api.post('/api/v1/document-transactions/summary');
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

