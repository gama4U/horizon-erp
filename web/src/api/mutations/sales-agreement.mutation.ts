import { AxiosError } from "axios";
import { ICreateSalesAgreement, ISalesAgreement, IUpdateSalesAgreement } from "../../interfaces/sales-agreement.interface";
import api from "../../utils/api.util";

export async function createSalesAgreement(data: ICreateSalesAgreement): Promise<ISalesAgreement & { message: string}> {
  try {
    const response = await api.post('/api/v1/sales-agreements', data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function updateSalesAgreement({salesAgreementId, ...data}: IUpdateSalesAgreement) {
  try {
    const response = await api.put(`/api/v1/sales-agreements/${salesAgreementId}`, data);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function deleteSalesAgreement(id: string) {
  try {
    const response = await api.delete(`/api/v1/sales-agreements/${id}`);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}

export async function approveSalesAgreement(id: string) {
  try {
    const response = await api.patch(`/api/v1/sales-agreements/${id}/approver`);
    return response.data;
  } catch(error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong')
  }
}