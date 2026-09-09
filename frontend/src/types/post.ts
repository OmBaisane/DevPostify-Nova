export interface PostAuthor {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  author: PostAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface PostsPagination {
  page: number;
  limit: number;
  totalPosts: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PostsResponseData {
  posts: Post[];
  pagination: PostsPagination;
}
