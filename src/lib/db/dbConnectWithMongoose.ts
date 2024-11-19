import mongoose, { ConnectOptions } from "mongoose";

let connectionString =
  process.env.NEXT_PUBLIC_CONFIG == "PROD"
    ? process.env.MONGODB_URI_PROD
    : process.env.NEXT_PUBLIC_CONFIG == "UAT"
    ? process.env.MONGODB_URI_UAT
    : process.env.MONGODB_URI_LOCAL;

const options: ConnectOptions = {
  family: 4,
};

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

const connectDB = async (dbName: string) => {
  if (!dbName) throw new Error("dbName is missing in params");
  if (!connectionString)
    throw new Error("Mongodb connectionString is undefined");

  connectionString = connectionString?.replace(/27017\//, `27017/${dbName}`);
  // connectionString = connectionString?.replace(/\/test\b/, `/${dbName}`);

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(connectionString as string, options)
      .then((mongoose) => {
        return mongoose;
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
