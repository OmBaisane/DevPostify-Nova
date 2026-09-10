import { Post } from "./post";

export interface ProfileUser {
  _id: string;
  id?: string;
  name: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileResponseData {
  profile?: ProfileUser;
  user?: ProfileUser;
  posts: Post[];
}
