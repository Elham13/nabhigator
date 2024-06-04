import { IZoneStateMaster } from "../utils/types/fniDataTypes";
import { Document, ObjectId, Schema, model, models } from "mongoose";

interface ZoneStateMaster extends Omit<IZoneStateMaster, "_id">, Document {
  _id: ObjectId;
}

const ZoneStateMasterSchema = new Schema<ZoneStateMaster>({
  State: { type: String, required: true },
  State_code: { type: String, required: true, unique: true },
  Zone: { type: String },
  zoneId: {
    type: String,
    required: true,
    unique: true,
    ref: "ZoneMaster",
  },
});

const ZoneStateMaster =
  models?.ZoneStateMaster ||
  model<ZoneStateMaster>("ZoneStateMaster", ZoneStateMasterSchema);

export default ZoneStateMaster;
