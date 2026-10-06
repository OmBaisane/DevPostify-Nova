import mongoose, { Document, Model, Schema } from "mongoose";

export interface Reaction {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  type: string;
  createdAt: Date;
}

export interface ReactionDocument extends Reaction, Document {}

const ReactionSchema = new Schema<ReactionDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "like",
      enum: ["like"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// Idempotency: guarantees one reaction per user per post
ReactionSchema.index({ user: 1, post: 1 }, { unique: true });

export const ReactionModel: Model<ReactionDocument> =
  mongoose.models.Reaction ||
  mongoose.model<ReactionDocument>("Reaction", ReactionSchema);
