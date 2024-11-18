import { ClientType, OfficeBranch } from "@prisma/client"

export interface ISupplier {
  id: string
  name: string
  address: string
  contact: string
  officeBranch: OfficeBranch
}

export interface ICreateSupplier {
  name: string
  address: string
  contact: string
  emailAddress: string;
  category?: string;
  notes: string;
  officeBranch: OfficeBranch
}
export interface IUpdateSupplier {
  id: string
  name: string
  address: string
  contact: string
  emailAddress: string;
  category?: string;
  notes: string;
  officeBranch: OfficeBranch
}

