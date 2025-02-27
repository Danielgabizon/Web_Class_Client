import api from "../utilities/api";
import {
  Credentials,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from "../types/authTypes";
import { ApiResponse } from "../types/apiType"; // Import the generic type

const API_URL = "/auth";

class AuthService {
  login(credentials: Credentials) {
    const controller = new AbortController();
    const request = api.post<ApiResponse<AuthResponse>>(
      `${API_URL}/login`,
      credentials,
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  register(userInfo: RegisterRequest) {
    const controller = new AbortController();
    const request = api.post<ApiResponse<RegisterResponse>>(
      `${API_URL}/register`,
      userInfo,
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  refresh() {
    const controller = new AbortController();
    const request = api.post<ApiResponse<AuthResponse>>(`${API_URL}/refresh`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  logout() {
    const controller = new AbortController();
    const request = api.post(`${API_URL}/logout`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}
const authService = new AuthService();
export default authService;
