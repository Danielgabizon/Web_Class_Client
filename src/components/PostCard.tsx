import { Post } from "../types/postTypes";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import postService from "../services/postService";
type PostCardProps = {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  showCommentBtn?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  showCommentBtn = true,
}) => {
  console.log("PostCard render");
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // user details
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState("");
  const [senderDetails, setSenderDetails] = useState<{
    username: string;
    profilePic: string;
  }>({
    username: "Loading...",
    profilePic: "/defaultUserIcon.png",
  });
  const [likeList, setLikelist] = useState<string[]>(post.likes!);
  useEffect(() => {
    console.log("PostCard useeffect");
    let cancelRequest: () => void;
    const fetchUserDetails = async () => {
      try {
        setLoadingUserDetails(true);
        const { request, cancel } = userService.getUser(post.sender!);
        cancelRequest = cancel;
        const response = await request;
        const { username, profileUrl } = response.data.data!;
        setSenderDetails({
          username: username,
          profilePic: profileUrl,
        });
      } catch (error: any) {
        console.error("Error fetching sender details", error);
        if (error.response) {
          // server responded with a status code that falls out of the range of 2xx
          setUserDetailsError(error.response.data.message);
        } else if (error.request) {
          // request was made but no response received
          setUserDetailsError(
            "No response from the server. Please try again later."
          );
        } else {
          // something else happened
          setUserDetailsError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoadingUserDetails(false);
      }
    };
    fetchUserDetails();
    return () => {
      if (cancelRequest) cancelRequest();
    };
  }, [post]);

  const toggleLike = async () => {
    try {
      const { request } = postService.toggleLike(post._id!);
      const response = await request;
      setLikelist(response.data.data!.likes!);
    } catch (error: any) {
      console.error("Error toggling like", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {loadingUserDetails ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : userDetailsError ? (
        <p className="text-red-500">{userDetailsError}</p> // Display error message
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={senderDetails.profilePic}
                alt="user"
                className="h-10 w-10 rounded-full"
              />
              <h2 className="font-semibold">{senderDetails.username}</h2>
            </div>
            {user?.id === post.sender && (
              <div className="flex space-x-4">
                <img
                  src="/editPostIcon.png"
                  className="w-4 h-4 opacity-60 cursor-pointer"
                  onClick={() => onEdit(post)}
                />
                <img
                  src="/deletePostIcon.png"
                  className="w-4 h-4 opacity-60 cursor-pointer"
                  onClick={() => onDelete(post)}
                />
              </div>
            )}
          </div>
          <div className="my-4">
            <Link to={`/post/${post._id}`}>
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="text-md text-gray-800 mt-2">{post.content}</p>
              {post.postUrl && (
                <img
                  src={post.postUrl}
                  alt="post"
                  className="w-full h-150 object-cover mt-4 rounded-md"
                />
              )}
            </Link>
          </div>

          <div className="flex mt-4 space-x-4">
            <button className="bg-[#4267B2] text-white p-2 rounded-md">
              Like
            </button>
            {showCommentBtn && (
              <Link to={`/post/${post._id}`}>
                <button className="bg-[#4267B2] text-white p-2 rounded-md cursor-pointer">
                  Comment
                </button>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
