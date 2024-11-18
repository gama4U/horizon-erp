import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IFetchPurchaseRequestData, IFetchPurchaseRequestOrders, IPurchaseRequestOrder } from "@/interfaces/purchase-request.interface";

export async function fetchPurchaseRequestOrders(params: IFetchPurchaseRequestOrders): Promise<IFetchPurchaseRequestData> {
  try {
    const response = await api.get('/api/v1/purchase-requests', {
      params
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

export async function fetchPurchaseRequestOrder(id: string): Promise<IPurchaseRequestOrder> {
  try {
    const response = await api.get(`/api/v1/purchase-requests/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

interface IPurchaseRequestSummary {
  total: number
  since7days: number
  rate: number
  cebuCount: number,
  calbayogCount: number
}
export async function fetchPurchaseRequestSummary(): Promise<IPurchaseRequestSummary> {
  try {
    const response = await api.post('/api/v1/purchase-requests/summary');
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
