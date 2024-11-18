export interface ICreatePurchaseRequestItem {
  purchaseRequestOrderId: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IUpdatePurchaseRequest {
  salesAgreementItemId: string;
  particulars: string;
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