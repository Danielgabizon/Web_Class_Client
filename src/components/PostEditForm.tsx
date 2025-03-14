import { useState, useEffect } from "react";
//import { useNavigate, Link } from "react-router-dom";
import Spinner from "./Spinner";
import uploadImage from "../utilities/uploadImage";
import postService from "../services/postService";
import { Post } from "../types/postTypes";

type PostEditFormProps = {
  post: Post;
  onPostEdit: (updatedPost: Post) => void;
  onClose: () => void;
};

const PostEditForm: React.FC<PostEditFormProps> = ({
  post,
  onPostEdit,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    photo: null as null | File,
  });
  const [preview, setPreview] = useState<string | null>(post.postUrl || null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let postUrl = post.postUrl; // Keep the old image if no new one is uploaded
      if (formData.photo) {
        postUrl = await uploadImage(formData.photo);
      }

      const { photo, ...formDatawithoutPhoto } = formData;
      const { request } = postService.updatePost(post._id!, {
        ...formDatawithoutPhoto,
        postUrl,
      });
      const response = await request;
      onPostEdit(response.data.data!);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  // Generate preview URL when photo is selected
  useEffect(() => {
    if (formData.photo) {
      const objectUrl = URL.createObjectURL(formData.photo);
      setPreview(objectUrl);
    }
  }, [formData.photo]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-2xl">
      <h2 className="text-xl font-semibold text-center mb-4">Edit Post</h2>
      {error && (
        <p className="text-red-500 text-center text-sm mb-4">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Post's Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />
        <input
          type="text"
          name="content"
          placeholder="Post's Content"
          value={formData.content}
          onChange={handleChange}
          required
          className="w-full p-3 bg-[#F5F6F7] border border-gray-300 rounded-lg focus:ring-[#4267B2]"
        />

        <div className="flex items-center justify-between space-x-4">
          <label className="text-gray-600 w-1/4">Photo</label>

          <div className="flex items-center space-x-4">
            {/* hidden Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />

            <label
              htmlFor="fileInput"
              className=" px-4 py-2 bg-[#F5F6F7] border border-gray-300 rounded-lg cursor-pointer w-full  text-center "
            >
              Choose File
            </label>

            <span className="text-gray-600">
              {formData.photo ? formData.photo.name : "No file chosen"}
            </span>
          </div>
        </div>

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover border border-gray-300 shadow-md"
            />
          </div>
        )}

        {/* Submit Button */}
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
              Edit
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PostEditForm;
