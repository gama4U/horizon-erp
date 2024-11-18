import { AxiosError } from "axios";
import { IAddSalesAgreementItem, IUpdateSalesAgreementItem } from "../../interfaces/sales-agreement-item.interface";
import api from "../../utils/api.util";

export async function addSalesAgreementItem(data: IAddSalesAgreementItem) {
  try {
    const response = await api.post('/api/v1/sales-agreement-items', data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function updateSalesAgreementItem({salesAgreementItemId, ...data}: IUpdateSalesAgreementItem) {
  try {
    const response = await api.put(`/api/v1/sales-agreement-items/${salesAgreementItemId}`, data);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}

export async function deleteSalesAgreementItem(id: string) {
  try {
    const response = await api.delete(`/api/v1/sales-agreement-items/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || "Something went wrong");
  }
}