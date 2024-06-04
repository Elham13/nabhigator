import { IUser } from "./fniDataTypes";

export interface IUserFromSession extends Omit<IUser, "password"> {}

export interface ISession {
  user: IUserFromSession;
  expires: Date;
  iat: number;
  exp: number;
}
