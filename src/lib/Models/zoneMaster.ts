import { IZoneMaster } from "../utils/types/fniDataTypes";
import { Document, ObjectId, Schema, model, models } from "mongoose";

interface ZoneMaster extends Omit<IZoneMaster, "_id">, Document {
  _id: ObjectId;
}

const ZoneMasterSchema = new Schema<ZoneMaster>({
  Zone: { type: String, required: true },
  zoneId: { type: String, required: true, unique: true },
});

const ZoneMaster =
  models?.ZoneMaster || model<ZoneMaster>("ZoneMaster", ZoneMasterSchema);

export default ZoneMaster;
