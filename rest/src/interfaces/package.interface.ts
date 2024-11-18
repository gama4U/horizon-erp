import { OfficeBranch } from "@prisma/client";

export interface IFindPackages {
  skip?: number;
  take?: number;
  search?: string;
  branch: OfficeBranch;
}

export interface ICreatePackage {
  creatorId: string;
  name: string;
  inclusions: string[];
  exclusions: string[];
  remarks: string;
  officeBranch: OfficeBranch;
}

export interface IUpdatePackage {
  id: string;
  name: string;
  inclusions: string[];
  exclusions: string[];
  remarks: string;
}
