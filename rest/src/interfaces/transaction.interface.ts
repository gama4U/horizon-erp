import { IClient } from "./client.interface";

export interface ITransaction {
  id: string;
  userId: string;
  client: IClient;
  travelVoucher?: any;
  accommodationVoucher?: any;
  tourVoucher?: any;
  transportVoucher?: any;
  salesAgreement?: any;
  purchaseOrder?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateTransactionApprover {
  id: string;
  approverId: string;
}
