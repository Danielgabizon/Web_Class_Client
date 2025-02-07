import { createContext, useEffect, useState } from "react";
import { ReactNode, FC } from "react";
import authService from "../services/authService";
import {
  Credentials,
  User,
  Tokens,
  AuthContextType,
  RegisterRequest,
} from "../types/authTypes";

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  console.log("AuthProvider rendered");
  useEffect(() => {
    console.log("AuthProvider mounted");
  });
  const [tokens, setTokens] = useState<Tokens | null>(
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens")!)
      : null
  );
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null
  );

  const register = async (registerRequest: RegisterRequest) => {
    await authService.register(registerRequest);
  };

  const login = async (credentials: Credentials) => {
    const response = await authService.login(credentials);
    const { accessToken, refreshToken, _id, username } = response.data!;
    localStorage.setItem(
      "tokens",
      JSON.stringify({ accessToken, refreshToken })
    );
    localStorage.setItem("user", JSON.stringify({ id: _id, username }));

    setTokens({ accessToken, refreshToken });
    setUser({ id: _id, username });
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error: any) {
      const errorMessage = "Logout failed";
      console.error({
        status: "Error",
        message: error.response.message || errorMessage,
      });
    } finally {
      // Whether the request is successful or not, remove the user data
      localStorage.removeItem("tokens");
      localStorage.removeItem("user");
      setTokens(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, tokens, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
