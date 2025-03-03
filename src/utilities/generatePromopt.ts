import api from "./api";
import { ApiResponse } from "../types/apiType";
const generatePrompt = async (prompt: string) => {
  try {
    const response = await api.post<ApiResponse<string>>("/gemini/generate", {
      prompt,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
export default generatePrompt;
