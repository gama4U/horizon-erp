import { OfficeBranch } from "@prisma/client";

export interface ICreatePurchaseRequest {
  creatorId: string;
  supplierId: string;
  salesAgreementId?: string;
  disbursementType: string;
  classification: string;
  classificationType: string;
  nos: string;
  other?: string;
  officeBranch: OfficeBranch;
}

export interface IUpdatePurchaseRequest {
  id: string;
  supplierId: string;
  salesAgreementId: string;
  disbursementType: string;
  classification: string;
  classificationType: string;
  nos: string;
  other?: string;
}

export interface IFindPurchaseRequests {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  type?: string;
  classification?: string;
}

export interface IUpdatePurchaseRequestApprover {
  id: string;
  approverId: string;
}
