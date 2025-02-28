import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";

import { User } from "../types/userTypes";
import { Post } from "../types/postTypes";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import userService from "../services/userService";
import postService from "../services/postService";
import PostList from "../components/PostList";
import PostEditForm from "../components/PostEditForm";
import PostDeleteForm from "../components/PostDeleteForm";
import Modal from "../components/Modal";

const Profile: React.FC = () => {
  console.log("Profile rendered");
  const { user } = useAuth();

  /* User */

  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string>("");
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    console.log("Profile mounted");
    let cancelRequest: () => void;
    const fetchProfile = async () => {
      try {
        setUserLoading(true);
        setUserError("");
        const { request, cancel } = userService.getUser(user!.id);
        cancelRequest = cancel;
        const response = await request;
        setUserDetails(response.data.data!);
        // setPosts(data.posts);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        if (error.response) {
          // server responded with a status code that falls out of the range of 2xx
          setUserError(error.response.data.message);
        } else if (error.request) {
          // request was made but no response received
          setUserError("No response from the server. Please try again later.");
        } else {
          setUserError("Something went wrong. Please try again later.");
        }
      } finally {
        setUserLoading(false);
      }
    };
    fetchProfile();
    return () => {
      if (cancelRequest) cancelRequest();
    };
  }, [user]);

  /* Posts */
  const [postsLoading, setPostsLoading] = useState(false);
  const [postError, setPostError] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

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

  useEffect(() => {
    console.log("Posts fetch useffect");
    let cancelRequest: () => void;
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        setPostError("");
        const { request, cancel } = postService.getAllPosts(user!.id);
        cancelRequest = cancel;
        const response = await request;
        setPosts(response.data.data!);
      } catch (error: any) {
        console.error("Error fetching posts:", error);
        if (error.response) {
          // server responded with a status code that falls out of the range of 2xx
          setPostError(error.response.data.message);
        } else if (error.request) {
          // request was made but no response received
          setPostError("No response from the server. Please try again later.");
        } else {
          setPostError("Something went wrong. Please try again later.");
        }
      } finally {
        setPostsLoading(false);
      }
    };
    fetchPosts();
    return () => {
      if (cancelRequest) cancelRequest();
    };
  }, []);

  /* Modal */
  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Open modal function
  const openModal = (type: "edit" | "delete", post?: Post) => {
    setModalType(type);
    setSelectedPost(post || null); // if type is create, post should be null
  };

  // Close modal function
  const closeModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="flex max-w-5xl w-full items-start  p-4 space-x-4">
        {/* User Section */}
        {userError && <p className="text-red-500">{userError}</p>}

        {userLoading ? (
          <Spinner />
        ) : (
          userDetails && (
            <div className="space-y-4 w-1/4">
              <img
                src={userDetails.profileUrl}
                alt={userDetails.username}
                className="w-50 h-50 rounded-full"
              />

              <div className="flex items-center space-x-2">
                <MdEmail className="text-gray-500" />
                <p className="text-gray-500">{userDetails.email}</p>
              </div>
            </div>
          )
        )}

        {/* Post Section */}

        <div className="space-y-2 w-3/4">
          {userDetails && (
            <h2 className="text-2xl font-semibold ">
              {userDetails.fname + " " + userDetails.lname}
            </h2>
          )}
          {postError && <p className="text-red-500">{postError}</p>}
          {postsLoading ? (
            <Spinner />
          ) : (
            posts && (
              <PostList
                posts={posts}
                onEdit={(post) => openModal("edit", post)}
                onDelete={(post) => openModal("delete", post)}
              />
            )
          )}
        </div>

        {/* Modal Rendering */}
        {modalType && (
          <Modal>
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
    </div>
  );
};
export default Profile;
