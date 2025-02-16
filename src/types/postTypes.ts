export interface Post {
  _id?: string;
  title: string;
  content: string;
  postUrl: string;
  sender?: string;
}

export interface createPostResponse {
  status: string;
  data?: Post;
  message?: string;
}
export interface getAllPostsResponse {
  status: string;
  data?: Post[];
  message?: string;
}
