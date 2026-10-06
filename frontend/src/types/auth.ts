export interface UserSocials {
  github?: string;
  linkedin?: string;
  website?: string;
}

export interface User {
  _id: string;
  id?: string;
  username: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  skills?: string[];
  specialties?: string[];
  socials?: UserSocials;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password?: string;
  email?: string;
  username?: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password?: string;
  name: string;
}

export interface AuthResponseData {
  user: User;
}
