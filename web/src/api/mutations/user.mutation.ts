import { ICreateUser, IUpdateUser } from "@/interfaces/user.interface";
import api from "@/utils/api.util";
import { AxiosError } from "axios";

export async function createUser(data: ICreateUser) {
  try {
    const response = await api.post('/api/v1/users', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function updateUser({id, ...data}: IUpdateUser) {
  try {
    const response = await api.put(`/api/v1/users/${id}`, data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await api.delete(`/api/v1/users/${id}`);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}
