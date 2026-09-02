import { Schema, model, type InferSchemaType } from "mongoose";

const bookmarkSchema = new Schema(
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
  },
  {
    timestamps: true,
  },
);

bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

export type Bookmark = InferSchemaType<typeof bookmarkSchema>;

export const BookmarkModel = model<Bookmark>("Bookmark", bookmarkSchema);
