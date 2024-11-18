import { PermissionType, UserType } from "@prisma/client";

export interface IFindUsers {
  skip?: number;
  take?: number;
  search?: string;
  type?: UserType;
  branch?: string | null;
}

export interface IUpdateUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType?: UserType;
  permission?: PermissionType;
  password?: string;
}

export interface IUpdateUserAvatar {
  id: string;
  avatar: string;
}

export interface IUpdateUserSignature {
  id: string;
  signature: string;
}

export interface IUpdateUserPassword {
  id: string;
  password: string;
}
