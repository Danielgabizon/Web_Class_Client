import api from "../utilities/api";
import { Comment } from "../types/commentTypes";
import { ApiResponse } from "../types/apiType";

class CommentService {
  createComment(comment: Comment, postId: string) {
    const controller = new AbortController();
    const request = api.post<ApiResponse<Comment>>(
      `/comments/${postId}`,
      comment,
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }

  getAllComments(postId?: string) {
    const controller = new AbortController();
    const request = api.get<ApiResponse<Comment[]>>(
      postId ? `/comments?postId=${postId}` : "/comments",
      {
        signal: controller.signal,
      }
    );
    return { request, cancel: () => controller.abort() };
  }
  deleteComment(id: string) {
    const controller = new AbortController();
    const request = api.delete(`/comments/${id}`, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
  updateComment(id: string, comment: Comment) {
    const controller = new AbortController();
    const request = api.put(`/comments/${id}`, comment, {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  }
}
const commentService = new CommentService();
export default commentService;
