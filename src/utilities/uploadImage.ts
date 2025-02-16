import api from "../services/authApi";

const uploadImage = async (photo: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", photo);

    const response = await api.post<{ url: string }>("/file", formData);
    return response.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image. Please try again.");
  }
};

export default uploadImage;
