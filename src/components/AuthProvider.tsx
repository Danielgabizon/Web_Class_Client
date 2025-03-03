import { useEffect, useState } from "react";
import authService from "../services/authService.ts";
import {
  Credentials,
  LoggedUser,
  Tokens,
  RegisterRequest,
} from "../types/authTypes.ts";
import authContext from "../context/authContext.ts";

type AuthProviderProps = {
  children: React.ReactNode;
};
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log("AuthProvider rendered");
  useEffect(() => {
    console.log("AuthProvider mounted");
  });
  const [tokens, setTokens] = useState<Tokens | null>(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens")!)
      : null
  );
  const [user, setUser] = useState<LoggedUser | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );

  const register = async (registerRequest: RegisterRequest) => {
    try {
      const { request } = authService.register(registerRequest);
      await request;
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        // Request was made but no response received
        throw new Error("No response from the server. Please try again later.");
      } else {
        // Something else happened
        throw new Error("Something went wrong. Please try again later.");
      }
    }
  };

  const login = async (credentials: Credentials) => {
    try {
      const { request } = authService.login(credentials);
      const response = await request;
      const { accessToken, refreshToken, _id, username, profileUrl } =
        response.data.data!;
      console.log("Login successful:", response.data.data!);
      localStorage.setItem(
        "tokens",
        JSON.stringify({ accessToken, refreshToken })
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ id: _id, username, profileUrl: profileUrl })
      );

      setTokens({ accessToken, refreshToken });
      setUser({ id: _id, username, profileUrl });
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.response) {
        // server responded with a status code that falls out of the range of 2xx
        throw new Error(error.response.data.message);
      } else if (error.request) {
        // request was made but no response received
        throw new Error("No response from the server. Please try again later.");
      } else {
        // something else happened
        throw new Error("Something went wrong. Please try again later.");
      }
    }
  };

  const logout = async () => {
    try {
      const { request } = authService.logout();
      await request;
    } catch (error: any) {
      console.error("Logout failed:", error);
    } finally {
      // Whether the request is successful or not, remove the user data
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setTokens(null);
      setUser(null);
    }
  };

  return (
    <authContext.Provider
      value={{ user, setUser, tokens, register, login, logout }}
    >
      {children}
    </authContext.Provider>
  );
};
export default AuthProvider;
