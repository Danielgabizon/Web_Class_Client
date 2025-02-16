import api from "./authApi";
import { AllUserResponse, UserResponse } from "../types/userTypes";

const getAllUsers = async (username?: string) => {
  let response;
  if (username) {
    response = await api.get<AllUserResponse>(`/users?username=${username}`);
  } else {
    response = await api.get<AllUserResponse>("/users");
  }
  return response.data;
};
const getUserById = async (id: string) => {
  const response = await api.get<UserResponse>(`/users/${id}`);
  return response.data;
};

export default { getUserById, getAllUsers };
