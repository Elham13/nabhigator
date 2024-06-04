import mongoose from "mongoose";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const Schema = new mongoose.Schema(
  {
    claimId: { type: Number, required: true },
    claimType: { type: String },
    spotNumber: { type: String },
    contractNumber: { type: String },
    membershipNumber: { type: String },
    pivotalCustomerId: { type: String },
    eventName: { type: String },
    eventDate: { type: Date, default: new Date() },
    userName: { type: String },
    eventRemarks: { type: String, default: "" },
    intimationDate: {
      type: String,
      default: dayjs().tz("Asia/Kolkata").format("DD-MMM-YYYY hh:mm:ss A"),
    },
    status: { type: Number, default: 1, required: true },
    recommendation: { type: String, default: "" },
    closureDate: { type: Date, default: null },
    investigator: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "ClaimInvestigator",
      default: null,
    },
    clusterManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    zonalManager: { type: String },
    qaBy: { type: String },
  },
  { timestamps: true }
);

const CaseEvent =
  mongoose?.models?.CaseEvent || mongoose.model("CaseEvent", Schema);

export default CaseEvent;
