import { ISupplier } from "@/api/mutations/supplier.mutation";
import { IPurchaseRequestOrderItem } from "./purchase-request-item.interface";
import { ISalesAgreement } from "./sales-agreement.interface";
import { IUser } from "./user.interface";
import { Currency } from "./sales-agreement-item.interface";

export interface IPurchaseRequestOrder {
  id: string;
  creatorId: string;
  approverId: string;
  salesAgreementId: string;
  supplierId: string;
  serialNumber: string;
  disbursementType: string;
  classification: string;
  classificationType: string;
  other: string;
  purchaseOrderItems: IPurchaseRequestOrderItem[],
  transaction?: any;
  creator?: IUser;
  approver?: IUser;
  salesAgreement?: ISalesAgreement;
  supplier?: ISupplier;
  currency: Currency;
  createdAt: Date;
  updatedAt: Date;
}

export enum PurchaseRequestOrderType {
  ACCOMMODATION = "ACCOMMODATION",
  DOMESTIC_AIRLINE_TICKETING = "DOMESTIC_AIRLINE_TICKETING",
  SHIPPING = "SHIPPING",
  INTERNATIONAL_AIRLINE_TICKETING = "INTERNATIONAL_AIRLINE_TICKETING",
  TRANSPORTATION_RENTAL = "TRANSPORTATION_RENTAL",
  VISA = "VISA"
}

export enum DisbursementType {
  "Cost of Sales" = "Cost of Sales",
  "Expenses" = "Expenses"
}

export enum CostOfSalesClassificationsType {
  "Ticketing" = "Ticketing",
  "Tour Packages" = "Tour Packages",
  "Documentation" = "Documentation",
  "Accommodation" = "Accommodation",
  "Transportation" = "Transportation",
  "Others" = "Others",
}
export enum ExpensesClassificationsType {
  "Operating Expenses" = "Operating Expenses",
  "MKT and Advertising" = "MKT and Advertising",
  "Administrative Exp" = "Administrative Exp",
  "Depreciation" = "Depreciation",
  "Taxes" = "Taxes",
  "Travel" = "Travel",
  "Employee Benefits" = "Employee Benefits",
}

export enum PaymentType {
  CASH = 'CASH',
  CHECK = 'CHECK'
}

export interface IFetchPurchaseRequestOrders {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  type?: DisbursementType | string
  classification?: CostOfSalesClassificationsType | ExpensesClassificationsType | string
}

export interface IFetchPurchaseRequestData {
  purchaseRequests: IPurchaseRequestOrder[];
  total: number;
}

export interface ICreatePurchaseRequest {
  supplierId: string;
  salesAgreementId?: string;
  disbursementType: string;
  classification: string;
  classificationType: string;
  currency?: Currency
  other?: string;
  approverId?: string;
}

export interface IUpdatePurchaseRequest {
  purchaseRequestId: string;
  supplierId: string;
  salesAgreementId?: string | null;
  disbursementType: string;
  classification: string;
  classificationType: string;
  currency?: Currency
  other?: string;
}
