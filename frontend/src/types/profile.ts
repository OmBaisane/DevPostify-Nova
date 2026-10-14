import { Post } from "./post";

export interface ProfileSocials {
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface ProfileUser {
  _id?: string;
  id?: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  specialties?: string[];
  socials?: ProfileSocials;
  createdAt: string;
}

export interface ProfileResponseData {
  user?: ProfileUser;
  profile?: ProfileUser;
  posts: Post[];
  postsCount: number;
  isOwner?: boolean;
}
