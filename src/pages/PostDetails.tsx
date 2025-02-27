import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import postService from "../services/postService";
import { Post } from "../types/postTypes";
import PostCard from "../components/PostCard";
import PostEditForm from "../components/PostEditForm";
import PostDeleteForm from "../components/PostDeleteForm";

import commentService from "../services/commentService";
import { Comment } from "../types/commentTypes";
import CommentList from "../components/CommentList";
import CommentCreateForm from "../components/CommentCreateForm";

import Spinner from "../components/Spinner";
import Modal from "../components/Modal";

const PostDetails = () => {
  /* Modal */

  // Modal States
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Open modal function
  const openModal = (type: "edit" | "delete", post: Post) => {
    setModalType(type);
    setSelectedPost(post);
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  /* Post */

  // Post States
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [postError, setPostError] = useState<string>("");

  // Fetch Post Details
  useEffect(() => {
    console.log("PostDetails useEffect1");
    let cancelRequest: () => void;
    const fetchPostDetails = async () => {
      try {
        setLoadingPost(true);
        const { request, cancel } = postService.getPost(postId!);
        cancelRequest = cancel;
        const response = await request;
        setPost(response.data.data!);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        if (error.response) {
          // server responded with a status code that falls out of the range of 2xx
          setPostError(error.response.data.message);
        } else if (error.request) {
          // request was made but no response received
          setPostError("No response from the server. Please try again later.");
        } else {
          // something else happened
          setPostError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoadingPost(false);
      }
    };
    fetchPostDetails();
    return () => cancelRequest && cancelRequest();
  }, [postId]);

  /* Comments */

  // Comment States
  const [loadingComments, setLoadingComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  //Fetch Comments
  useEffect(() => {
    console.log("PostDetails useEffect2");
    let cancelRequest: () => void;
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const { request, cancel } = commentService.getAllComments(postId!);
        cancelRequest = cancel;
        const response = await request;
        setComments(response.data.data!);
      } catch (error: any) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    if (postId) fetchComments();
    return () => cancelRequest && cancelRequest();
  }, [postId]);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="flex flex-col max-w-4xl w-full p-4 space-y-4">
        {/* Post Error Message */}
        {postError && (
          <div className="p-4 text-red-500 bg-red-100 border border-red-200 rounded-lg">
            {postError}
          </div>
        )}

        {loadingPost || loadingComments ? (
          <div className="flex justify-center mt-4">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Post Card */}
            {post && (
              <PostCard
                key={post._id}
                post={post}
                onEdit={(post) => openModal("edit", post)}
                onDelete={(post) => openModal("delete", post)}
                showCommentBtn={false}
              />
            )}

            {/* Comment Form */}
            {postId && <CommentCreateForm postId={postId} />}

            {/* Comment List */}
            <CommentList comments={comments} />
          </>
        )}

        {/* Modal Rendering */}
        {modalType && (
          <Modal>
            {modalType === "edit" && (
              <PostEditForm post={selectedPost!} onClose={closeModal} />
            )}
            {modalType === "delete" && (
              <PostDeleteForm post={selectedPost!} onClose={closeModal} />
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
