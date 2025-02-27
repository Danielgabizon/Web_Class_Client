export interface Post {
  _id?: string;
  title: string;
  content: string;
  postUrl: string;
  sender?: string;
  likes?: string[];
}
