export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterRequest extends Credentials {
  email: string;
  fname: string;
  lname: string;
}

export interface User {
  id: string;
  username: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  tokens: Tokens | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (registerRequest: RegisterRequest) => Promise<void>;
}

export interface AuthResponse {
  status: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    _id: string;
    username: string;
  };
  message?: string;
}
