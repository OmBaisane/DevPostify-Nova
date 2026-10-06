import { Author } from "./post";

export interface Comment {
  _id: string;
  id?: string;
  post: string;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponseData {
  comments: Comment[];
  total: number;
}
