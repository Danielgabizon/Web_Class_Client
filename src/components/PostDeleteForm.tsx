import React from "react";
import { Post } from "../types/postTypes";
import postService from "../services/postService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
type PostDeleteFormProps = {
  post: Post;
  onPostDelete: (postId: string) => void;
  onClose: () => void;
};
const PostDeleteForm: React.FC<PostDeleteFormProps> = ({
  post,
  onPostDelete,
  onClose,
}) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { request } = postService.deletePost(post._id!);
      const response = await request;
      onPostDelete(post._id!);
      onClose();
    } catch (error: any) {
      console.error("Error editing post:", error);
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
    <div className="bg-white p-4 rounded-lg shadow-md w-2xl">
      <h2 className="text-xl text-center font-semibold mb-4">Delete Post</h2>
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}
      <p className=" text-l mb-4">Are you sure you want to delete this post?</p>
      <form onSubmit={handleSubmit}>
        {loading ? (
          <div className="flex justify-center items-center ">
            <Spinner />
          </div>
        ) : (
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className=" w-40 bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-40 bg-[#1877F2] text-white py-2 rounded-lg font-bold hover:bg-[#165DB6] transition"
            >
              Delete
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostDeleteForm;
