import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, "state is required"],
    },
    districts: {
      type: [String],
    },
  },
  { timestamps: true }
);

const StatesAndDistricts =
  mongoose.models?.StatesAndDistricts ||
  mongoose.model("StatesAndDistricts", Schema);

export default StatesAndDistricts;
