export interface User {
  id?: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
