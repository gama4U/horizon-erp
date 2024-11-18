import { ICreatePurchaseRequest, IPurchaseRequestOrder, IUpdatePurchaseRequest } from "@/interfaces/purchase-request.interface";
import api from "@/utils/api.util";
import { AxiosError } from "axios";

export async function createPurchaseRequest(data: ICreatePurchaseRequest): Promise<IPurchaseRequestOrder & { message: string}> {
  try {
    const response = await api.post('/api/v1/purchase-requests', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function updatePurchaseRequest({purchaseRequestId, ...data}: IUpdatePurchaseRequest) {
  try {
    const response = await api.put(`/api/v1/purchase-requests/${purchaseRequestId}`, data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function deletePurchaseRequest(id: string) {
  try {
    const response = await api.delete(`/api/v1/purchase-requests/${id}`);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function approvePurchaseRequestOrder(id: string) {
  try {
    const response = await api.patch(`/api/v1/purchase-requests/${id}/approver`);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
