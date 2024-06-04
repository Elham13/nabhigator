import { IMaximusResponseLog } from "../utils/types/fniDataTypes";
import { Document, Schema, model, models } from "mongoose";

interface IMaximusResponseLogSchema
  extends Omit<IMaximusResponseLog, "_id">,
    Document {}

const MaximusResponseLogSchema = new Schema<IMaximusResponseLogSchema>(
  {
    api: { type: String, required: true },
    originFileName: { type: String, required: true },
    claimId: { type: Number },
    dashboardDataId: {
      type: Schema.Types.ObjectId,
      ref: "DashboardData",
      default: null,
    },
    requestBody: { type: Schema.Types.Mixed },
    responseBody: { type: Schema.Types.Mixed },
    requestHeaders: { type: Schema.Types.Mixed },
    errorPayloadFromCatchBlock: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const MaximusResponseLog =
  models.MaximusResponseLog ||
  model<IMaximusResponseLogSchema>(
    "MaximusResponseLog",
    MaximusResponseLogSchema
  );

export default MaximusResponseLog;
