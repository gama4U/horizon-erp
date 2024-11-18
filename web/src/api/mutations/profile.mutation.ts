import { IChangeUserPassword, IUpdateUserProfile } from "@/interfaces/user.interface";
import api from "@/utils/api.util";
import { AxiosError } from "axios";

export async function updateAvatar(avatarUrl: string) {
  try {
    const response = await api.patch('/api/v1/profile/avatar', {avatar: avatarUrl});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function updateProfile(data: IUpdateUserProfile) {
  try {
    const response = await api.put('/api/v1/profile', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function  updateUserPassword(data: IChangeUserPassword) {
  try {
    const response = await api.put('/api/v1/profile/password', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

export async function  updateUserSignature(signatureUrl: string) {
  try {
    const response = await api.patch('/api/v1/profile/signature', {signature: signatureUrl});
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
