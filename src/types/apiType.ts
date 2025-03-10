export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
  };
}
