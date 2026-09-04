import { Schema, model, type InferSchemaType } from "mongoose";

const postSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
    },

    content: {
      type: String,
      required: true,
      minlength: 1,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
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
  },
  {
    timestamps: true,
  },
);

postSchema.index({ createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });

export type Post = InferSchemaType<typeof postSchema>;

export const PostModel = model<Post>("Post", postSchema);
