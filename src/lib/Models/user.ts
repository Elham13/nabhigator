import {
  IUser,
  IUserLeave,
  UserConfig,
  UserExpedition,
} from "../utils/types/fniDataTypes";
import mongoose, { models, Document, model, Schema } from "mongoose";

interface IUserSchema extends Omit<IUser, "_id">, Document {}
interface IExpeditionSchema
  extends Omit<UserExpedition, "_id" | "role">,
    Document {
  role: string;
}

interface IConfigSchema extends Omit<UserConfig, "_id">, Document {}
interface ILeaveSchema extends Omit<IUserLeave, "_id">, Document {}

const ExpeditionSchema = new Schema<IExpeditionSchema>(
  {
    claimId: { type: Number, required: true },
    message: { type: String, default: "" },
    noted: { type: Boolean, default: false },
    subject: { type: String, default: "" },
    role: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const ConfigSchema = new Schema<IConfigSchema>(
  {
    leadView: {
      type: [String],
    },
    isPreQcAutomated: { type: Boolean, default: false },
    canSeeConsolidatedInbox: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    canSeeFailedCases: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    canExportConsolidatedInbox: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    dailyThreshold: { type: Number, default: 0 },
    dailyAssign: { type: Number, default: 0 },
    claimAmount: { type: [String], default: [] },
    preAuthPendency: { type: Number, default: 0 },
    rmPendency: { type: Number, default: 0 },
    reportReceivedTime: {
      from: { type: Date, default: null },
      to: { type: Date, default: null },
      is24Hour: { type: Boolean, default: false },
    },
    thresholdUpdatedAt: { type: Date, default: null },
    triggerSubType: { type: String, default: "Non Mandatory" },
    pendency: {
      preAuth: [{ claimId: { type: Number }, type: { type: String } }],
      rm: [{ claimId: { type: Number }, type: { type: String } }],
    },
  },
  { timestamps: true }
);

const LeaveSchema = new Schema<ILeaveSchema>(
  {
    fromDate: { type: Date, default: null },
    toDate: { type: Date, default: null },
    status: {
      type: String,
      enum: {
        values: ["Requested", "Approved", "Rejected", ""],
      },
      default: "",
    },
    remark: { type: String },
  },
  { timestamps: true }
);

const UserSchema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: { type: String },
    phone: { type: String },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: [String],
      required: [true, "role is required"],
    },
    activeRole: { type: String },
    status: {
      type: String,
      enum: {
        values: ["Active", "Inactive"],
        message:
          "Please provide one of the following values:=> Active, Inactive",
      },
      required: [true, "status is required"],
    },
    userType: {
      type: String,
      enum: {
        values: ["Internal", "External"],
        message:
          "Please provide one of the following values:=> Internal, External",
      },
      required: [true, "userType is required"],
    },
    config: ConfigSchema,
    team: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pinCode: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: [String] },
    zone: { type: [String], default: [] },
    claimAmountThreshold: {
      type: String,
      enum: {
        values: [
          "Any Amount",
          "Bellow 1 Lac",
          "1 Lac to 5 Lacs",
          "5 Lacs to 10 Lacs",
          "10 Lacs to 20 Lacs",
          "20 Lacs to 50 Lacs",
          "Above 50 Lacs",
        ],
      },
    },
    leave: LeaveSchema,
    updates: {
      userIsInformed: { type: Boolean, default: true },
      details: { type: mongoose.Schema.Types.Mixed },
      expedition: {
        type: [ExpeditionSchema],
        default: [],
      },
    },
  },
  { timestamps: true }
);

const User = models?.User || model<IUserSchema>("User", UserSchema);

export default User;
