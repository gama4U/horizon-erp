import { ClientType, Currency, OfficeBranch } from "@prisma/client";

export interface ICreateSalesAgreement {
  creatorId: string;
  clientId: string;
  currency: Currency;
  officeBranch: OfficeBranch;
}

export interface IUpdateSalesAgreement {
  id: string;
  clientId: string;
  currency: Currency;
}

export interface IFindSalesAgreements {
  skip?: number;
  take?: number;
  search?: string;
  branch?: string;
  typeOfClient?: ClientType;
}

export interface IUpdateSalesAgreementApprover {
  id: string;
  approverId: string;
}
