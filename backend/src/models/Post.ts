import mongoose, { Document, Model, Schema } from "mongoose";

export interface Post {
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isDraft: boolean;
  reactionsCount: number;
  commentsCount: number;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostDocument extends Post, Document {}

const PostSchema = new Schema<PostDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: "",
    },
    isDraft: {
      type: Boolean,
      default: false,
      index: true,
    },
    reactionsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexing for high-performance feed sorting and draft segregation
PostSchema.index({ isDraft: 1, createdAt: -1 });
PostSchema.index({ isDraft: 1, category: 1, createdAt: -1 });
PostSchema.index({ isDraft: 1, reactionsCount: -1 });

// Full-text search index for keyword discovery
PostSchema.index({
  title: "text",
  content: "text",
  tags: "text",
});

export const PostModel: Model<PostDocument> =
  mongoose.models.Post || mongoose.model<PostDocument>("Post", PostSchema);
