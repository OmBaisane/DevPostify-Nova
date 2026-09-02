import mongoose from "mongoose";
import { env } from "./env";

export const connectDatabase = async (): Promise<void> => {
  if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log(`MongoDB connected : ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
