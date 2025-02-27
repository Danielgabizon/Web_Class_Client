export interface Credentials {
  username: string;
  password: string;
}

export interface RegisterRequest extends Credentials {
  email: string;
  fname: string;
  lname: string;
  profileUrl: string;
}
export interface RegisterResponse {
  _id: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
  profileUrl: string;
}

export interface LoggedUser {
  id: string;
  username: string;
  userPic: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  _id: string;
  username: string;
  userPic: string;
}

export interface AuthContextType {
  user: LoggedUser | null;
  tokens: Tokens | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (registerRequest: RegisterRequest) => Promise<void>;
}
