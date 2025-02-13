import { Post } from "../types/postTypes";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import userService from "../services/userService";

const PostCard = ({
  post,
  onEdit,
  onDelete,
}: {
  post: Post;
  onEdit: any;
  onDelete: any;
}) => {
  const { user } = useAuth();
  const [senderDetails, setSenderDetails] = useState<{
    username: string;
    profilePic: string;
  }>({
    username: "Loading...",
    profilePic: "/defaultUserIcon.png",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await userService.getUserById(post.sender!);
        const { username, profileUrl } = response.data!;
        setSenderDetails({
          username: username,
          profilePic: profileUrl,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    if (post.sender) {
      fetchUserDetails();
    }
  }, [post.sender]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer">
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
      <div className="mt-4 mb-4">
        <h2 className="font-bold text-lg">{post.title}</h2>
        <p className="text-sm text-gray-800 mt-2">{post.content}</p>
        {post.postUrl && (
          <img
            src={post.postUrl}
            alt="post"
            className="w-full h-150 object-cover mt-4 rounded-md"
          />
        )}
      </div>
      <div className="flex mt-4 space-x-4">
        <button className="bg-[#4267B2] text-white px-4 py-2 rounded-md">
          Like
        </button>
        <button className="bg-[#4267B2] text-white px-4 py-2 rounded-md">
          Comment
        </button>
      </div>
    </div>
  );
};

export default PostCard;
