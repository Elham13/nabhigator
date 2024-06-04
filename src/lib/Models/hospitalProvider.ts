import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    providerNumber: {
      type: String,
    },
    providerName: {
      type: String,
    },
    providerType: {
      type: String,
    },
    providerAddress: {
      type: String,
    },
    providerCity: {
      type: String,
    },
    providerState: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    fraudList: {
      type: Boolean,
      default: false,
    },
    coutionList: {
      type: Boolean,
      default: false,
    },
    preferPartnerList: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const HospitalProvider =
  mongoose.models?.HospitalProviderList ||
  mongoose.model("HospitalProviderList", Schema);

export default HospitalProvider;
