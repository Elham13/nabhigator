import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
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
    config: {
      leadView: {
        type: [String],
      },
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: { type: String },
    state: { type: [String] },
  },
  { timestamps: true }
);

const UsersMaster =
  mongoose.models?.UsersMaster || mongoose.model("UsersMaster", Schema);

export default UsersMaster;
