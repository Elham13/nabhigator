import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    Title: {
      type: String,
      required: [true, "Title is required"],
    },
    City_code: {
      type: String,
      unique: true,
      required: true,
    },
    State_code: {
      type: String,
      unique: true,
      required: true,
      ref: "ZoneStateMaster",
    },
    State: {
      type: String,
    },
  },
  { timestamps: true }
);

const NewCityMaster =
  mongoose.models?.NewCityMaster || mongoose.model("NewCityMaster", Schema);

export default NewCityMaster;
