export interface Author {
  _id: string;
  id?: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface Post {
  _id: string;
  id?: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  coverImage?: string;
  isDraft?: boolean;
  reactionsCount: number;
  commentsCount: number;
  isReactedByMe?: boolean;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PostListResponse {
  posts: Post[];
  pagination: Pagination;
}

// Backward-compatible alias for existing V1 pages (like app/page.tsx)
export interface PostsResponseData {
  posts: Post[];
  pagination?: Pagination;
  total?: number;
}
