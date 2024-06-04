import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    PIN_CODE: {
      type: String,
      unique: true,
      required: true,
    },
    CITY_CODE: {
      type: String,
      unique: true,
      required: true,
      ref: "NewCityMaster",
    },
    STATE_CODE: {
      type: String,
      unique: true,
      required: true,
      ref: "ZoneStateMaster",
    },
    CITY_NAME: {
      type: String,
    },
    STATE_NAME: {
      type: String,
    },
  },
  { timestamps: true }
);

const NewPinCodeMaster =
  mongoose.models?.NewPinCodeMaster ||
  mongoose.model("NewPinCodeMaster", Schema);

export default NewPinCodeMaster;
