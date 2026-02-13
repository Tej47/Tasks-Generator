import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
  var mongoose: { conn: mongoose.Mongoose | null; promise: Promise<mongoose.Mongoose> | null } | undefined;
}

const cached = global.mongoose ?? { conn: null, promise: null };
if (process.env.NODE_ENV !== "production") {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB using the MONGODB_URI environment variable.
 * Reuses the existing connection in development to avoid creating multiple connections
 * during hot reloads. Safe to call on every request.
 *
 * @throws {Error} When MONGODB_URI is not set
 * @returns The Mongoose instance (connected)
 */
export async function connectDB(): Promise<mongoose.Mongoose> {
  if (!MONGODB_URI?.trim()) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
