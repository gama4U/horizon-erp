import { IUser } from "./user.interface";

export interface SessionData {
  token: string | null; 
  user: IUser | null;
}

