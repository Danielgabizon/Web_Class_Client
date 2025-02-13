import api from "./authApi";
import {
  createPostResponse,
  Post,
  getAllPostsResponse,
} from "../types/postTypes";

const createPost = async (post: Post) => {
  const response = await api.post<createPostResponse>("/posts", post);
  return response.data;
};

const getAllPosts = async (sender?: string): Promise<getAllPostsResponse> => {
  let response;
  if (sender) {
    response = await api.get<getAllPostsResponse>("/posts?sender=" + sender);
  } else {
    response = await api.get<getAllPostsResponse>("/posts");
  }
  return response.data;
};

const updatePost = async (id: string, post: Post) => {
  const response = await api.put(`/posts/${id}`, post);
  return response.data;
};

const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
// const getPost = async (id) => {
//   const response = await api.get(`/posts/${id}`);
//   return response.data;
// };

export default { createPost, getAllPosts, updatePost, deletePost };
