import React, { useState, useEffect, useRef } from "react";
import PostList from "../components/PostList";
import postService from "../services/postService";
import { Post } from "../types/postTypes";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import PostCreateForm from "../components/PostCreateForm";
import PostEditForm from "../components/PostEditForm";
import PostDeleteForm from "../components/PostDeleteForm";
import userService from "../services/userService";
const Feed: React.FC = () => {
  console.log("Feed render");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  // Posts State
  const [filter, setFilter] = useState<string>(""); // Filter by username
  const [posts, setPosts] = useState<Post[]>([]);

  //  handle post creation
  const handlePostCreate = (newPost: Post) => {
    setPosts((prevPosts) => [...prevPosts, newPost]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };
  const handlePostDelete = (deletedPostId: string) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post._id !== deletedPostId)
    );
  };

  // Modal State
  const [modalType, setModalType] = useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Open modal function
  const openModal = (type: "create" | "edit" | "delete", post?: Post) => {
    setModalType(type);
    setSelectedPost(post || null); // if type is create, post should be null
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  // Fetch Posts
  useEffect(() => {
    console.log("Feed mounted");
    let cancelUserRequest: () => void;
    let cancelPostRequest: () => void;

    const fetchPosts = async () => {
      try {
        setLoading(true);

        if (filter) {
          // fetch user by filter (username)
          const { request: userRequest, cancel: cancelUser } =
            userService.getAllUsers(filter);
          cancelUserRequest = cancelUser; // store the cancel function

          const userResponse = await userRequest;

          if (userResponse.data.data!.length === 0) {
            // No user found, set posts to empty array
            setPosts([]);
          } else {
            // user found, fetch posts by user ID
            const userId = userResponse.data.data![0]._id;

            const { request: postRequest, cancel: cancelPost } =
              postService.getAllPosts(userId);
            cancelPostRequest = cancelPost;

            const postResponse = await postRequest;

            setPosts(postResponse.data.data!);
          }
        } else {
          // No filter, fetch all posts
          const { request: postRequest, cancel: cancelPost } =
            postService.getAllPosts();
          cancelPostRequest = cancelPost; // Store the cancel function

          const postResponse = await postRequest;

          setPosts(postResponse.data.data!);
        }
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        if (error.response) {
          // server responded with a status code that falls out of the range of 2xx
          setError(error.response.data.message);
        } else if (error.request) {
          // request was made but no response received
          setError("No response from the server. Please try again later.");
        } else {
          setError("Something went wrong. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Cleanup function to abort requests if the component unmounts or filter changes
    return () => {
      // Abort the user request if it exists
      if (cancelUserRequest) cancelUserRequest();

      // Abort the post request if it exists
      if (cancelPostRequest) cancelPostRequest();
    };
  }, [filter]);

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="flex flex-col max-w-3xl w-full p-4 space-y-4">
        {/* Error Message */}
        {error && (
          <div className="text-center p-4 text-red-500 bg-red-100 border border-red-200 rounded-lg">
            {error}
          </div>
        )}
        {/* Create Post Button and Filter */}
        <div className="flex justify-between space-x-4">
          <input
            type="text"
            placeholder="Filter by username"
            className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <button
            onClick={() => openModal("create")}
            className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg cursor-pointer text-center"
          >
            Create a new post
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center mt-8">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Post List */}
            <PostList
              posts={posts}
              onEdit={(post) => openModal("edit", post)}
              onDelete={(post) => openModal("delete", post)}
            />
          </>
        )}
      </div>

      {/* Modal Rendering */}
      {modalType && (
        <Modal>
          {modalType === "create" && (
            <PostCreateForm
              onClose={closeModal}
              onPostCreate={handlePostCreate}
            />
          )}
          {modalType === "edit" && (
            <PostEditForm
              post={selectedPost!}
              onClose={closeModal}
              onPostEdit={handlePostUpdate}
            />
          )}
          {modalType === "delete" && (
            <PostDeleteForm
              post={selectedPost!}
              onClose={closeModal}
              onPostDelete={handlePostDelete}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Feed;
