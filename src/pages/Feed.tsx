import React, { useState, useEffect } from "react";
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

  // Posts State
  const [filter, setFilter] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const openEditModal = (post: Post) => {
    setIsEditModalOpen(true);
    setEditingPost(post);
  };
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  // Delete Post Modal State
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openDeleteModal = (post: Post) => {
    setIsDeleteModalOpen(true);
    setDeletingPost(post);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPost(null);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        if (filter) {
          // if filter is not empty, fetch posts by username
          const response = await userService.getAllUsers(filter);
          if (response.data!.length == 0) {
            // if no user found, set posts to empty array
            setPosts([]);
            setLoading(false);
            return;
          }
          // User is found so fetch posts by user id
          const response2 = await postService.getAllPosts(
            response.data![0]._id
          );
          setPosts(response2.data!);
          setLoading(false);
          return;
        } else {
          // if filter is empty, fetch all posts
          const response = await postService.getAllPosts();
          setPosts(response.data!);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    console.log("Feed mounted");
    fetchPosts();
  }, [filter]);

  return (
    <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
      {/* Create Post Button and Filter */}
      <div className="w-full justify-between flex space-x-4 mt-4">
        <input
          type="text"
          placeholder="Filter posts by username"
          className=" px-4 py-2 bg-[#F5F6F7] border border-gray-300 rounded-lg text-center "
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#F5F6F7] border border-gray-300 rounded-lg cursor-pointer text-center"
        >
          Create a new post
        </button>
      </div>

      {/* Post List */}
      {loading ? (
        <Spinner />
      ) : (
        <PostList
          posts={posts}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      )}

      {/* Create Post Modal */}
      <Modal isOpen={isCreateModalOpen}>
        <PostCreateForm onClose={closeCreateModal} />
      </Modal>

      {/* Edit Post Modal */}
      <Modal isOpen={isEditModalOpen}>
        {editingPost && (
          <PostEditForm post={editingPost} onClose={closeEditModal} />
        )}
      </Modal>

      {/* Delete Post Modal */}
      <Modal isOpen={isDeleteModalOpen}>
        {deletingPost && (
          <PostDeleteForm post={deletingPost} onClose={closeDeleteModal} />
        )}
      </Modal>
    </div>
  );
};

export default Feed;
