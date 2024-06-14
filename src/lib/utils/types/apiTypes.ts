import { HydratedDocument, ObjectId } from "mongoose";
import { IDashboardData, IUser, Investigator } from "./fniDataTypes";

export interface IDefineInvestigator {
  isManual: boolean;
  body: any;
  user: IUser;
  dashboardData: HydratedDocument<IDashboardData>;
  excludedIds?: ObjectId[];
}

export interface IDefineInvestigatorReturnType {
  success: boolean;
  shouldSendRes: boolean;
  message: string;
  investigators: Investigator[];
  excludedInvestigators?: ObjectId[];
}

export interface ISendCaseToAllocation {
  dashboardData: HydratedDocument<IDashboardData>;
  body: any;
  user: IUser;
  eventRemarks: string;
}

export interface IAllocationType {
  allocationType: "Single" | "Dual";
  investigatorType?: "Internal" | "External";
  fallbackAllocationType?: IAllocationType;
}

export interface IFindInvestigatorsProps {
  allocation: IAllocationType;
  dashboardData: IDashboardData;
  excludedIds?: ObjectId[];
}

export interface IFindInvestigatorReturnType {
  success: boolean;
  investigators: Investigator[];
  message: string;
}

export interface IUpdateInvReturnType {
  success: boolean;
  message: string;
  recycle: boolean;
  excludedInv?: ObjectId;
}
