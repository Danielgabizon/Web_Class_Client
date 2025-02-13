export interface User {
  _id: string;
  username: string;
  email: string;
  fname: string;
  lname: string;
  profileUrl: string;
}
export interface UserResponse {
  status: string;
  data?: User;
  message?: string;
}

export interface AllUserResponse {
  status: string;
  data?: User[];
  message?: string;
}
