import mongoose from "mongoose";
// TODO: Never add another document in this collection, This collection is supposed to contain only one document

const Schema = new mongoose.Schema(
  {
    autoPreQC: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FNIManager = mongoose.models?.FNIManager || mongoose.model("FNIManager", Schema);

export default FNIManager;
