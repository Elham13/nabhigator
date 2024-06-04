import { IDDataFeedingLog } from "../utils/types/fniDataTypes";
import { ObjectId } from "mongodb";
import { Document, model, models ,Schema} from "mongoose";

interface FeedingLog extends Omit<IDDataFeedingLog, "_id">, Document {
  _id: ObjectId;
}

const DashboardDataFeedingLogsSchema = new Schema<FeedingLog>(
  {
    totalRecords: {
      type: Number,
    },
    insertedRecords: {
      type: Number,
    },
    skippedRecords: {
      type: Number,
    },
    foundAndUpdatedRecords: {
      type: Number,
    },
    skippedClaimIds: {
      type: [String],
    },
    skippedReasons: {
      type: [String],
    },
  },
  { timestamps: true }
);

const DashboardFeedingLog =
  models?.DashboardFeedingLog ||
  model("DashboardFeedingLog", DashboardDataFeedingLogsSchema);

export default DashboardFeedingLog;
