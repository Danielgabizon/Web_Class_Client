import api from "./authApi";
import { Credentials, RegisterRequest, AuthResponse } from "../types/authTypes";
const API_URL = "/auth";

const login = async (credentials: Credentials) => {
  try {
    const response = await api.post<AuthResponse>(
      `${API_URL}/login`,
      credentials
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

const register = async (userInfo: RegisterRequest) => {
  try {
    const response = await api.post(`${API_URL}/register`, userInfo);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message || "Something went wrong");
  }
};

const refresh = async () => {
  const response = await api.post<AuthResponse>(`${API_URL}/refresh`);
  return response.data;
};

const logout = async () => {
  const response = await api.post(`${API_URL}/logout`);
  return response.data;
};

export default { login, register, refresh, logout };
