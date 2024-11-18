export interface IUser {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  userType: UserType;
  permission: PermissionType;
  password?: string;
  avatar?: string;
  signature?: string;
  officeBranch?: OfficeBranch;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserType {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum PermissionType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  ACCOUNTING = 'ACCOUNTING',
  RESERVATION = 'RESERVATION',
}

export enum OfficeBranch {
  CEBU = 'CEBU',
  CALBAYOG = 'CALBAYOG'
}

export interface IUserSession {
  token: string;
  user: IUser
}

export interface IUserCredential {
  email: string;
  password: string
}

export interface IFetchUsers {
  skip?: number;
  take?: number;
  search?: string;
  userType?: string;
  branch?: string | null;
}

export interface IFetchUsersData {
  users: IUser[];
  total: number;
}

export interface ICreateUser {
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  password: string;
  permission?: PermissionType;
}

export interface IUpdateUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: UserType;
  password?: string;
}

export interface IUpdateUserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface IChangeUserPassword {
  currentPassword: string;
  password: string;
}
