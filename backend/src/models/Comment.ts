import mongoose, { Document, Model, Schema } from "mongoose";

export interface Comment {
  post: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentDocument extends Comment, Document {}

const CommentSchema = new Schema<CommentDocument>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

// High-speed retrieval for comments on a specific post
CommentSchema.index({ post: 1, createdAt: -1 });

export const CommentModel: Model<CommentDocument> =
  mongoose.models.Comment ||
  mongoose.model<CommentDocument>("Comment", CommentSchema);
