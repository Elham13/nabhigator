import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    Title: {
      type: String,
    },
    Code: {
      type: String,
    },
    State: {
      type: String,
    },
    Description: {
      type: String,
    },
    HospitalLocations: {
      type: String,
    },
    PremiumCalculator: {
      type: String,
    },
    ID: {
      type: String,
    },
    MetroCity: {
      type: String,
    },
  },
  { timestamps: true }
);

const CityMaster =
  mongoose?.models?.CityMaster || mongoose.model("CityMaster", Schema);

export default CityMaster;
