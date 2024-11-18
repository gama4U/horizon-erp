import { AxiosError } from "axios";
import api from "../../utils/api.util";
import { IFetchTransaction, ITransaction } from "../../interfaces/transaction.interface";
import { IUser } from "@/interfaces/user.interface";

export async function fetchTransaction({ id }: IFetchTransaction): Promise<ITransaction> {
	try {
		const response = await api.get(`/api/v1/transactions/${id}`);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || 'Something went wrong');
	}
}
export interface IFetchTransactions {
	search?: string
	skip?: number
	take?: number
	travel?: boolean;
	accommodation?: boolean;
	tour?: boolean;
	transport?: boolean;
	branch?: string | null
}
export interface ITransactions {
	transactions: ITransaction[],
	total: number
}
export async function fetchTransactions({ ...params }: IFetchTransactions): Promise<ITransactions> {
	try {
		const response = await api.get('/api/v1/transactions', {
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

export interface IFetchTransactionsSummary {
	from: Date | undefined;
	to?: Date | undefined;
}
export type EnrichedTransaction = {
	createdAt: string;
	voucherCounts: {
		travel: number;
		accommodation: number;
		tour: number;
		transport: number;
	};
};


export interface ITransactionsSummary {
	enrichedTransactions: EnrichedTransaction[]
	since7days: any,
	rate: number,
	total: number,
	calbayogCount: number,
	cebuCount: number,
}

export async function fetchTransactionsSummary(data: IFetchTransactionsSummary): Promise<ITransactionsSummary> {
	try {
		const response = await api.post('/api/v1/transactions/summary', data);
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || 'Something went wrong');
	}
}
export interface RecentActivity {
	createdAt: Date
	preparedBy: IUser
	creator: IUser
	type: string
	purchaseOrderId: string
	salesAgreementId: string
	id: string
	status: string
}

export async function fetchRecentAcitvities(): Promise<RecentActivity[]> {
	try {
		const response = await api.post('/api/v1/transactions/recent-activities');
		return response.data;
	} catch (error) {
		let message;
		if (error instanceof AxiosError) {
			message = error.response?.data.message;
		}
		throw new Error(message || 'Something went wrong');
	}
}


