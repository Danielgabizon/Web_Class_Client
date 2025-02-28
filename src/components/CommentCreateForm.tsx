import commentService from "../services/commentService";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { IoSend } from "react-icons/io5"; // Install with: npm install react-icons
import Spinner from "./Spinner";
import { Comment } from "../types/commentTypes";
type CommentCreateFormProps = {
  onCommentCreate: (newComment: Comment) => void;
  postId: string;
};

const CommentCreateForm: React.FC<CommentCreateFormProps> = ({
  postId,
  onCommentCreate,
}) => {
  console.log("CommentCreateForm rendered");
  const { userPic } = useAuth().user!;
  const [formData, setFormData] = useState({
    content: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { content } = formData;
      const { request } = commentService.createComment({ content }, postId);
      const response = await request;
      onCommentCreate(response.data.data!);
      setFormData({ content: "" });
    } catch (error: any) {
      console.error("Error creating comment:", error);
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex items-center space-x-2 ">
        <img src={userPic} alt="user" className="w-8 h-8 rounded-full" />
        <div className="flex flex-col w-full space-y-2 relative">
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#1877F2] transition"
              value={formData.content}
              onChange={handleChange}
              name="content"
              placeholder="What do you think of that post?"
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
      </div>
    </div>
  );
};
export default CommentCreateForm;
