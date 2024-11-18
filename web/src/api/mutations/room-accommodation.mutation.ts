import { AxiosError } from "axios";
import api from "../../utils/api.util";

export interface IAddRoomAccommodation {
	id?: string
	accommodationId: string
	childrenCount?: number | 0
	infantCount?: number | 0
	seniorCount?: number | 0
	adultCount?: number | 0
}

export async function addRoomAccommodation(data: IAddRoomAccommodation) {
	try {
		const response = await api.post(`/api/v1/accommodation-vouchers/${data.accommodationId}/room`, data);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || "Something went wrong");
	}
}

export async function updateRoomAccommodation({ accommodationId, ...data }: IAddRoomAccommodation) {
	try {
		const response = await api.put(`/api/v1/accommodation-vouchers/${accommodationId}/room/${data.id}`, data);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || "Something went wrong");
	}
}

export interface IDeleteRoomAccommodation {
	id: string
	accommodationId: string
}

export async function deleteRoomAccommodation({ id, accommodationId }: IDeleteRoomAccommodation) {
	try {
		const response = await api.delete(`/api/v1/accommodation-vouchers/${accommodationId}/room/${id}`);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || "Something went wrong");
	}
}
