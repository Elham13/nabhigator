import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    DIST_CODE: {
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
    District: {
      type: String,
    },
    State: {
      type: String,
    },
  },
  { timestamps: true }
);

const NewStateDistrictMaster =
  mongoose.models?.NewStateDistrictMaster ||
  mongoose.model("NewStateDistrictMaster", Schema);

export default NewStateDistrictMaster;
