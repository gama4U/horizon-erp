import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { ITransaction } from "@/interfaces/transaction.interface";
import { IUser, OfficeBranch } from "@/interfaces/user.interface";
import { ISalesAgreement } from "@/interfaces/sales-agreement.interface";

export interface ICreateClient {
  name?: string
  email?: string
  contactNumber?: string
  clientType: TypeOfClient
  documents?: string[]
  department?: string
  officeBranch?: OfficeBranch;
  notes?: string;
  approverId?: string;
  creatorId: string;
}
export interface IUpdateClient {
  id: string
  name?: string
  email?: string
  contactNumber?: string
  contactPerson?: string
  documents?: string[]
  department?: string
  officeBranch?: OfficeBranch
  notes?: string;
}

export enum TypeOfClient {
  WALK_IN = 'WALK_IN',
  CORPORATE = 'CORPORATE',
  GOVERNMENT = 'GOVERNMENT',
  GROUP = 'GROUP',
  INDIVIDUAL = 'INDIVIDUAL'
}

export interface IClient {
  id: string
  name?: string
  email?: string
  notes?: string
  creatorId: string;
  approverId: string;
  contactNumber?: string
  contactPerson?: string
  documents?: string[]
  department?: string
  officeBranch?: OfficeBranch
  salesAgreements?: ISalesAgreement[]
  transactions?: ITransaction[]
  clientType: TypeOfClient
  creator?: IUser
  approver?: IUser

  createdAt: Date
  updatedAt: Date
}

export async function createClient(data: ICreateClient): Promise<IClient> {
  try {
    const response = await api.post('/api/v1/clients', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function updateClient({ id, ...data }: IUpdateClient) {
  try {
    const response = await api.put(`/api/v1/clients/${id}`, data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deleteClient(id: string) {
  try {
    const response = await api.delete(`/api/v1/clients/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}
export async function approveClient(id: string) {
  try {
    const response = await api.patch(`/api/v1/clients/${id}/approver`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}


