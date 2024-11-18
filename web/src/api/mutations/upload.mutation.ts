import { AxiosError } from "axios";
import { IUploadFile } from "../../interfaces/upload.interface";
import api from "../../utils/api.util";

export async function uploadFile({data, onUploadProgress}: IUploadFile): Promise<{url: string}> {
  try {
    const response = await api.post('/api/v1/uploads', data, { onUploadProgress });
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deleteFile(fileName: string) {
  try {
    const response = await api.delete(`/api/v1/uploads/${fileName}`);
    return response.data;
  } catch(error) {
    let message;
    if(error instanceof AxiosError) {
      message =  error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
