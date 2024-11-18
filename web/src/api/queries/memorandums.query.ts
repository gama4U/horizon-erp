import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IUser } from "@/interfaces/user.interface";

interface IFetchMemorandums {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string | null,
}

export interface IMemorandum {
  id: string
  memorandumNumber: string
  to: string
  subject: string
  contents: string
  creator: IUser
  approver: IUser

  createdAt: Date
  updatedAt: Date
}

interface IMemorandums {
  memorandumData: IMemorandum[]
  total: number
}

export async function fetchMemorandums({ ...params }: IFetchMemorandums): Promise<IMemorandums> {
  try {
    const response = await api.get('/api/v1/memorandums', {
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

export async function fetchMemorandum(id: string): Promise<IMemorandum> {
  try {
    const response = await api.get(`/api/v1/memorandums/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

interface IMemorandumSummary {
  total: number
  since7days: number
  rate: number
  calbayogCount: number
  cebuCount: number
}
export async function fetchMemorandumSummary(): Promise<IMemorandumSummary> {
  try {
    const response = await api.post('/api/v1/memorandums/summary');
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
