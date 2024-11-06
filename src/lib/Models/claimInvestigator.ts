import {
  IInvestigatorCityData,
  IInvestigatorPinCodeData,
  IInvestigatorProviderData,
  IInvestigatorStateData,
  Investigator,
  UserExpedition,
} from "../utils/types/fniDataTypes";
import mongoose, { Document, Schema, model } from "mongoose";
import { models } from "mongoose";

interface IInvestigatorSchema extends Omit<Investigator, "_id">, Document {}
interface IProviderSchema
  extends Omit<IInvestigatorProviderData, "_id">,
    Document {}
interface IInvestigatorSchema extends Omit<Investigator, "_id">, Document {}
interface IPinCodeSchema
  extends Omit<IInvestigatorPinCodeData, "_id">,
    Document {}
interface ICitySchema extends Omit<IInvestigatorCityData, "_id">, Document {}
interface IStateSchema extends Omit<IInvestigatorStateData, "_id">, Document {}
interface IExpeditionSchema
  extends Omit<UserExpedition, "_id" | "role">,
    Document {
  role: string;
}

const PinCodeDataSchema = new Schema<IPinCodeSchema>({
  name: { type: String },
  pinCodes: [String],
});

const CityDataSchema = new Schema<ICitySchema>({
  name: { type: String },
  cities: [String],
});

const StateDataSchema = new Schema<IStateSchema>({
  name: { type: String },
  states: [String],
});

const ProviderDataSchema = new Schema<IProviderSchema>({
  name: { type: String },
  providers: [String],
});

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

const PendencySchema = new Schema(
  {
    preAuth: { type: [Number], default: [] },
    rm: { type: [Number], default: [] },
  },
  { timestamps: true }
);

const InvestigatorSchema = new Schema<IInvestigatorSchema>(
  {
    investigatorName: {
      type: String,
      required: [true, "investigatorName is required"],
    },
    phone: { type: String, required: true, unique: true },
    email: { type: [String], required: true, unique: true },
    password: { type: String, required: true },
    investigatorCode: { type: String, required: true, unique: true },
    Type: {
      type: String,
      enum: ["Internal", "External"],
      required: [true, "Type is required"],
    },
    Mode: {
      type: String,
    },
    assignmentPreferred: {
      type: [String],
    },
    dailyThreshold: {
      type: Number,
      required: [true, "dailyThreshold is required"],
    },
    monthlyThreshold: {
      type: Number,
      required: [true, "monthlyThreshold is required"],
    },
    dailyAssign: {
      type: Number,
      default: 0,
    },
    monthlyAssigned: {
      type: Number,
      default: 0,
    },
    userStatus: {
      type: String,
      enum: ["active", "inactive"],
      required: [true, "userStatus is required"],
    },
    inactiveReason: {
      type: String,
    },
    inactiveFrom: {
      type: Date,
    },
    inactiveTo: {
      type: Date,
    },
    hitRate: {
      type: Number,
      default: 0,
    },
    TAT: {
      type: Number,
      default: 0,
    },
    performance: {
      type: Number,
      default: 0,
    },
    pinCodeData: PinCodeDataSchema,
    pinCodes: [String],
    cityData: CityDataSchema,
    cities: [String],
    district: [String],
    stateData: StateDataSchema,
    states: [String],
    providerData: ProviderDataSchema,
    providers: [String],
    rejectedCases: [Number],
    updatedDate: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      enum: ["Leader", "TeamMate", "None"],
      default: "None",
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClaimInvestigator",
      default: null,
    },
    updates: {
      expedition: {
        type: [ExpeditionSchema],
        default: [],
      },
    },
    pendency: {
      type: PendencySchema,
      default: null,
    },
  },
  { timestamps: true }
);

const ClaimInvestigator =
  models?.ClaimInvestigator ||
  model<IInvestigatorSchema>("ClaimInvestigator", InvestigatorSchema);

export default ClaimInvestigator;
