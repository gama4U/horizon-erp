import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IClient, TypeOfClient } from "../mutations/client.mutation";

interface IFetchClients {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string | null,
  typeOfClient?: TypeOfClient | string,
  isApproved?: boolean
}

interface IClients {
  clientsData: IClient[]
  total: number
}
export async function fetchClients({ ...params }: IFetchClients): Promise<IClients> {
  try {
    const response = await api.get('/api/v1/clients', {
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

export interface IClientSummary {
  month: string;
  desktop: number;
  calbayogCount: number;
  cebuCount: number;
}

export async function fetchClientsSummary(startMonth: number, endMonth: number): Promise<IClientSummary[]> {
  try {
    const response = await api.post('/api/v1/clients/summary', {
      startMonth,
      endMonth
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

