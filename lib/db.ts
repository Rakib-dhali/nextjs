import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("please define mongoUri in env variables");
}

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}
const cached = global.mongoose;

async function connectDB(): Promise<Connection | null> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export { connectDB };
