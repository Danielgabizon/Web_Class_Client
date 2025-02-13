import React from "react";
import { Post } from "../types/postTypes";
import postService from "../services/postService";
import Spinner from "./Spinner";
import { useState } from "react";
const PostDeleteForm = ({ post, onClose }: { post: Post; onClose: any }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);
      await postService.deletePost(post._id!);
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-150">
      <h2 className="text-xl text-center font-semibold mb-4">Delete Post</h2>
      <p className=" text-l mb-4">Are you sure you want to delete this post?</p>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="flex justify-end space-x-4">
        {loading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="flex justify-center space-x-4">
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
