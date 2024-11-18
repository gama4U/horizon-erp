import { IAccommodationVoucher } from "./accommodation.interface";
import { IPurchaseRequestOrder } from "./purchase-request.interface";
import { ISalesAgreement } from "./sales-agreement.interface";
import { ITourVoucher } from "./tour.interface";
import { ITransportVoucher } from "./transport.interface";
import { ITravelVoucher } from "./travel.interface";
import { IUser } from "./user.interface";
import { IClient } from "@/api/mutations/client.mutation";

export interface ICreatedTransaction {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
}

export interface IHorizonOnlyFields {
  creator: IUser;
  salesAgreement: ISalesAgreement
}

export interface IVoucherCounts {
  travel: number;
  accommodation: number;
  tour: number;
  transport: number;
}

export interface ITransaction {
  id: string;
  transactionNumber: string;
  client: IClient;
  preparedBy: IUser;
  approver: IUser;
  travelVoucher?: ITravelVoucher[]
  accommodationVoucher?: IAccommodationVoucher[]
  tourVoucher?: ITourVoucher[]
  transportVoucher?: ITransportVoucher[]
  salesAgreement?: ISalesAgreement
  salesAgreementId?: string
  purchaseOrderId?: string
  purchaseOrder?: IPurchaseRequestOrder
  createdAt?: Date
  updatedAt?: Date
  voucherCounts: IVoucherCounts;
}

export interface IFetchTransaction {
  id?: string;
}

export type VoucherFilters = {
  [key in VoucherTypes]: boolean;
};
export enum VoucherTypes {
  TRAVEL = 'travel',
  ACCOMMODATION = 'accommodation',
  TOUR = 'tour',
  TRANSPORT = 'transport',
}
