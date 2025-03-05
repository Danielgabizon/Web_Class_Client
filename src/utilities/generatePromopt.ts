import api from "./api";
import { ApiResponse } from "../types/apiType";
const generatePrompt = async (prompt: string) => {
  try {
    const response = await api.post<ApiResponse<string>>("/gemini/generate", {
      prompt,
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response) {
      // server responded with a status code that falls out of the range of 2xx
      throw new Error(error.response.data.message);
    } else if (error.request) {
      // request was made but no response received
      throw new Error("No response from the server. Please try again later.");
    } else {
      throw new Error("Something went wrong. Please try again later.");
    }
  }
};
export default generatePrompt;
