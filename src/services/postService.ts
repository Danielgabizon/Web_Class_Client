import api from "../utilities/api";
import { Post } from "../types/postTypes";
import { ApiResponse } from "../types/apiType"; // Import the generic type

class PostService {
  createPost(post: Post) {
    const controller = new AbortController();
    const request = api.post<ApiResponse<Post>>("/posts", post, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  getPost(id: string) {
    const controller = new AbortController();
    const request = api.get<ApiResponse<Post>>(`/posts/${id}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  // get all posts (optionally filtered by sender)
  getAllPosts(sender_id?: string) {
    const controller = new AbortController();
    const request = api.get<ApiResponse<Post[]>>(
      sender_id ? `/posts?sender=${sender_id}` : "/posts",
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  updatePost(id: string, post: Post) {
    const controller = new AbortController();
    const request = api.put<ApiResponse<Post>>(`/posts/${id}`, post, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }

  deletePost(id: string) {
    const controller = new AbortController();
    const request = api.delete<ApiResponse<null>>(`/posts/${id}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
  toggleLike(id: string) {
    const controller = new AbortController();
    const request = api.post<ApiResponse<Post>>(`/posts/like/${id}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}

const postService = new PostService();
export default postService;
