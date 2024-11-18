import { IPurchaseRequestOrder } from "./purchase-request.interface";

export interface IPurchaseRequestOrderItem {
  id: string;
  purchaseRequestOrderId: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
  purchaseRequestOrder?: IPurchaseRequestOrder;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddPurchaseRequestItem {
  purchaseRequestOrderId: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IUpdatePurchaseRequestItem {
  id: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
}
