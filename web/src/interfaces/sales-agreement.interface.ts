import { IClient } from "@/api/mutations/client.mutation";
import { Currency, ISalesAgreementItem } from "./sales-agreement-item.interface";
import { IUser } from "./user.interface";
import { IPurchaseRequestOrder } from "./purchase-request.interface";

export interface ISalesAgreement {
  id: string;
  creatorId: string;
  approverId: string;
  clientId: string;
  serialNumber: string;
  currency: Currency;
  salesAgreementItems: ISalesAgreementItem[];
  purchaseRequestOrders: IPurchaseRequestOrder[];
  transaction: any;
  client: IClient;
  creator?: IUser;
  approver?: IUser;
  updatedAt: Date;
  createdAt: Date;
}

export enum TypeOfClient {
  WALK_IN = 'WALK_IN',
  CORPORATE = 'CORPORATE',
  GOVERNMENT = 'GOVERNMENT',
  GROUP = 'GROUP',
  INDIVIDUAL = 'INDIVIDUAL'
}

export interface ICreateSalesAgreement {
  clientId: string;
  currency: Currency;
  approverId?: string;
}

export interface IUpdateSalesAgreement {
  salesAgreementId: string;
  clientId: string;
  currency: Currency;
}

export interface IFetchSalesAgreements {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  typeOfClient?: TypeOfClient | string
}

export interface IFetchSalesAgreementsData {
  salesAgreements: ISalesAgreement[];
  total: number;
}

export type ClientTypeFilter = TypeOfClient;
