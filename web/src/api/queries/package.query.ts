import { IFetchPackages, IFetchPackagesData, IPackage } from "@/interfaces/package.interface";
import api from "@/utils/api.util";
import { AxiosError } from "axios"

export const fetchPackages = async(params: IFetchPackages): Promise<IFetchPackagesData> => {
  try {
		const response = await api.get('/api/v1/packages', { params });
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || 'Something went wrong')
	}
}

export const fetchPackage = async(id: string): Promise<IPackage> => {
  try {
		const response = await api.get(`/api/v1/packages/${id}`);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || 'Something went wrong')
	}
}
