import { AxiosError } from "axios";
import api from "../../utils/api.util";

export interface ICreateMemorandum {
  to: string
  subject: string
  contents: string
  creatorId: string
  branch?: string
}

export interface IUpdateMemorandum {
  id: string
  to: string
  subject: string
  contents: string
}
export interface ICreatedMemorandum {
  id: string
  creatorId: string
}

export async function createMemorandum(data: ICreateMemorandum): Promise<ICreatedMemorandum> {
  try {
    const response = await api.post('/api/v1/memorandums', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function updateMemorandum(data: IUpdateMemorandum) {
  try {
    const response = await api.put(`/api/v1/memorandums/${data.id}`, data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deleteMemorandum(id: string) {
  try {
    const response = await api.delete(`/api/v1/memorandums/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function approveMemorandum(id: string) {
  try {
    const response = await api.patch(`/api/v1/memorandums/${id}/approver`);
    return response.data
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

