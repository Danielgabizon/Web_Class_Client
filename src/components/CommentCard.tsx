import { Comment } from "../types/commentTypes";
import { useEffect, useState } from "react";
import userService from "../services/userService";
import Spinner from "./Spinner";
import useAuth from "../hooks/useAuth";
import commentService from "../services/commentService";
import { IoSend } from "react-icons/io5";

type CommentCardProps = {
  comment: Comment;
};
const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  console.log("CommentCard");
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const [showEdit, setShowEdit] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  useEffect(() => {
    console.log("CommentCard useEffect");
    let cancelRequest: () => void;
    const fetchUserDetails = async () => {
      setLoadingUserDetails(true);
      try {
        const { request, cancel } = userService.getUser(comment.sender!);
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
    return () => cancelRequest();
  }, [comment.sender]);

  const handleDelete = async () => {
    try {
      const { request } = commentService.deleteComment(comment._id!);
      await request;
      window.location.reload();
    } catch (error: any) {
      console.error("Error deleting comment", error);
      if (error.response) {
        // server responded with a status code that falls out of the range of 2xx
        setError(error.response.data.message);
      } else if (error.request) {
        // request was made but no response received
        setError("No response from the server. Please try again later.");
      } else {
        // something else happened
        setError("Something went wrong. Please try again later.");
      }
    }
  };
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { request } = commentService.updateComment(comment._id!, {
        content: editContent,
      });
      await request;
      window.location.reload();
    } catch (error: any) {
      console.error("Error editing comment", error);
      if (error.response) {
        // server responded with a status code that falls out of the range of 2xx
        setError(error.response.data.message);
      } else if (error.request) {
        // request was made but no response received
        setError("No response from the server. Please try again later.");
      } else {
        // something else happened
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 shadow-md">
      {loadingUserDetails ? (
        <Spinner />
      ) : userDetailsError ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="flex items-center space-x-4">
          <img
            src={senderDetails.profilePic}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="w-full flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{senderDetails.username}</h2>
              {user?.id === comment.sender && (
                <div className="flex space-x-4">
                  <img
                    src="/editPostIcon.png"
                    className="w-4 h-4 opacity-60 cursor-pointer"
                    onClick={() => setShowEdit(!showEdit)}
                  />
                  <img
                    src="/deletePostIcon.png"
                    className="w-4 h-4 opacity-60 cursor-pointer"
                    onClick={handleDelete}
                  />
                </div>
              )}
            </div>
            <p className="text-md text-gray-800">{comment.content}</p>
            {showEdit && (
              <div className="relative">
                {error && <p className="text-red-500 text-xs">{error}</p>}
                <form onSubmit={handleEdit}>
                  <textarea
                    className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#1877F2] transition"
                    name="content"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />
                  {loading ? (
                    <div className="absolute bottom-4 right-4">
                      <Spinner />
                    </div>
                  ) : (
                    <button
                      type="submit"
                      className="absolute bottom-4 right-4 text-[#1877F2] hover:text-[#165DB6] transition"
                    >
                      <IoSend size={24} />
                    </button>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default CommentCard;
