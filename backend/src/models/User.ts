import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    avtar: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model<User>("User", userSchema);
