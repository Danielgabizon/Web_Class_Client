import { Post } from "../types/postTypes";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import postService from "../services/postService";
import { MdEdit } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineComment } from "react-icons/ai";

type PostCardProps = {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  showLikeBtn?: boolean;
  showCommentBtn?: boolean;
};

const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onDelete,
  showCommentBtn = true,
  showLikeBtn = true,
}) => {
  console.log("PostCard render");

  const { user } = useAuth();

  const [likelist, setLikelist] = useState<string[]>(post.likes!);

  /* sender details */

  const [loadingUserDetails, setLoadingUserDetails] = useState(false);
  const [userDetailsError, setUserDetailsError] = useState("");
  const [senderDetails, setSenderDetails] = useState<{
    username: string;
    profilePic: string;
  }>({
    username: "Loading...",
    profilePic: "/defaultUserIcon.png",
  });

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
      await request;
      if (likelist.includes(user!.id!)) {
        // Remove user ID from likelist
        setLikelist((prev) => prev.filter((id) => id !== user!.id!));
      } else {
        // Add user ID to likelist
        setLikelist([...likelist, user!.id!]);
      }
    } catch (error: any) {
      console.error("Error toggling like", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {loadingUserDetails ? (
        <div className="flex justify-center items-center h-32">
          <Spinner />
        </div>
      ) : userDetailsError ? (
        <p className="text-red-500">{userDetailsError}</p> // Display error message
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <img
              src={senderDetails.profilePic}
              alt="user"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="w-full flex flex-col ml-2">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold">{senderDetails.username}</h2>
                {user?.id === post.sender && (
                  <div className="flex space-x-4">
                    <MdEdit
                      size={15}
                      className="text-gray-500 cursor-pointer hover:text-gray-700 transition"
                      onClick={() => onEdit(post)}
                    />
                    <ImBin
                      size={15}
                      className="text-gray-500 cursor-pointer hover:text-red-500 transition"
                      onClick={() => onDelete(post)}
                    />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(post.createdAt!).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                at{" "}
                {new Date(post.createdAt!).toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </div>
            </div>
          </div>
          <div>
            <Link to={`/post/${post._id}`}>
              <h2 className="font-bold text-lg">{post.title}</h2>
              <p className="text-md text-gray-800 mt-2">{post.content}</p>
              {post.postUrl && (
                <img
                  src={post.postUrl}
                  alt="post"
                  className="w-full h-200 object-cover mt-4 rounded-md"
                />
              )}
            </Link>
          </div>

          {likelist.length > 0 && (
            <span className="text-gray-500 text-sm">
              {likelist.length === 1
                ? "1 person liked this post"
                : `${likelist.length} people liked this post`}
            </span>
          )}
          <div className="flex mt-4 space-x-4">
            {showLikeBtn && (
              <button
                onClick={toggleLike}
                className={`flex items-center space-x-1 cursor-pointer ${
                  likelist.includes(user!.id!)
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                <AiOutlineLike size={15} />
                <span>{likelist.includes(user!.id!) ? "Liked" : "Like"}</span>
              </button>
            )}

            {showCommentBtn && (
              <Link
                to={`/post/${post._id}`}
                className="flex items-center space-x-1 cursor-pointer text-gray-500"
              >
                <AiOutlineComment size={15} />
                <span>Comment</span>
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PostCard;
