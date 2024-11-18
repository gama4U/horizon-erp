import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IFetchSalesAgreements, IFetchSalesAgreementsData, ISalesAgreement } from "../../interfaces/sales-agreement.interface";

export async function fetchSalesAgreements(params: IFetchSalesAgreements): Promise<IFetchSalesAgreementsData> {
  try {
    const response = await api.get('/api/v1/sales-agreements', {
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

export async function fetchSalesAgreement(id: string): Promise<ISalesAgreement> {
  try {
    const response = await api.get(`/api/v1/sales-agreements/${id}`);
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}

interface ISalesAgreementSummary {
  total: number
  since7days: number
  rate: number
  calbayogCount: number
  cebuCount: number
}
export async function fetchSalesAgreementSummary(): Promise<ISalesAgreementSummary> {
  try {
    const response = await api.post('/api/v1/sales-agreements/summary');
    return response.data;
  } catch (error) {
    let message;
    if (error instanceof AxiosError) {
      message = error.response?.data.message;
    }
    throw new Error(message || 'Something went wrong');
  }
}
