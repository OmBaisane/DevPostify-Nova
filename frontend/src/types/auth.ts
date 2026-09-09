export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseData {
  user: User;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}
