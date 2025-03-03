import api from "../utilities/api";
import { User } from "../types/userTypes";
import { ApiResponse } from "../types/apiType"; // Import the generic type

class UserService {
  getAllUsers(username?: string) {
    const controller = new AbortController();
    const request = api.get<ApiResponse<User[]>>(
      username ? `/users?username=${username}` : "/users",
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }
  getUser(id: string) {
    const controller = new AbortController();
    const request = api.get<ApiResponse<User>>(`/users/${id}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
  updateUser(id: string, data: User) {
    const controller = new AbortController();
    const request = api.put<ApiResponse<User>>(`/users/${id}`, data, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}
const userService = new UserService();
export default userService;
