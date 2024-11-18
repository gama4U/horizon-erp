export interface ICreateSalesAgreementItem {
  salesAgreementId: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
  serviceFee?: number;
}

export interface IUpdateSalesAgreementItem {
  salesAgreementItemId: string;
  particulars: string[];
  quantity: number;
  unitPrice: number;
  total: number;
  serviceFee?: number;
}
