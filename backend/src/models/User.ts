import mongoose, { Document, Model, Schema } from "mongoose";

export interface UserSocials {
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface User {
  username: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills: string[];
  specialties: string[];
  socials: UserSocials;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
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
      maxlength: 60,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    specialties: {
      type: [String],
      default: [],
    },
    socials: {
      github: { type: String, default: "", trim: true },
      linkedin: { type: String, default: "", trim: true },
      website: { type: String, default: "", trim: true },
    },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
