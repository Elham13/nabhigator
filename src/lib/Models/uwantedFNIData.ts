import { Schema, model, models } from "mongoose";
import {
  IClaimsBenefits,
  IClaimsData,
} from "../utils/types/maximusResponseTypes";

interface IUnwantedFNIDataSchema extends IClaimsData, Document {}
interface IClaimsBenefitsSchema extends IClaimsBenefits, Document {}

const ClaimsBenefitsSchema = new Schema<IClaimsBenefitsSchema>({
  Benefit_Type: { type: String },
  Benefit_Head: { type: String },
});

const UnwantedFNIDataSchema = new Schema<IUnwantedFNIDataSchema>(
  {
    Claims: { type: String },
    SourceSystem: { type: String },
    ClaimsBenefits: { type: [ClaimsBenefitsSchema], default: [] },
  },
  { timestamps: true }
);

const UnwantedFNIData =
  models?.UnwantedFNIData ||
  model<IUnwantedFNIDataSchema>("UnwantedFNIData", UnwantedFNIDataSchema);

export default UnwantedFNIData;
