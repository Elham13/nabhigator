import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    CITY_CODE: {
      type: String,
    },
    PIN_CODE: {
      type: String,
    },
    CITY_NAME: {
      type: String,
    },
    STATE_CODE: {
      type: String,
    },
    STATE_NAME: {
      type: String,
    },
  },
  { timestamps: true }
);

const PinCodeMaster =
  mongoose.models?.PinCodeMaster || mongoose.model("PinCodeMaster", Schema);

export default PinCodeMaster;
