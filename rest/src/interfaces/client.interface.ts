import { ClientType, OfficeBranch } from "@prisma/client"

export interface IClient {
  id: string
  name: string
  email: string
  contactNumber: string
  documents: string[]
  officeBranch: OfficeBranch
  contactPerson: string
}

export interface ICreateClient {
  name: string
  email: string
  contactPerson?: string
  contactNumber: string
  documents: string[]
  officeBranch: OfficeBranch
  clientType: ClientType;
  notes?: string;
  creatorId: string
  department?: string
}
export interface IUpdateClient {
  name?: string
  email?: string
  contactNumber?: string
  officeBranch: OfficeBranch;
  notes?: string;
  contactPerson?: string
}

