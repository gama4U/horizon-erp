import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IAddPurchaseRequestItem, IUpdatePurchaseRequestItem } from "@/interfaces/purchase-request-item.interface";

export async function addPurchaseRequestItem(data: IAddPurchaseRequestItem) {
  try {
    const response = await api.post('/api/v1/purchase-request-items', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function updatePurchaseRequestItem({id, ...data}: IUpdatePurchaseRequestItem) {
  try {
    const response = await api.put(`/api/v1/purchase-request-items/${id}`, data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deletePurchaseRequestItem(id: string) {
  try {
    const response = await api.delete(`/api/v1/purchase-request-items/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}