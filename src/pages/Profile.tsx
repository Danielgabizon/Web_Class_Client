import { useEffect, useState } from "react";
import { MdEmail, MdPerson, MdSettings } from "react-icons/md";
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
import ProfileEditForm from "../components/ProfileEditForm";
import Pagination from "../components/Pagination";
const Profile: React.FC = () => {
  console.log("Profile rendered");
  const { user, setUser } = useAuth();

  /* User */

  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState<string>("");
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    console.log("Profile userdetails fetch useffect");
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
  }, []);

  const handleProfileEdit = (newUserDetails: User) => {
    setUserDetails(newUserDetails);
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        username: newUserDetails.username,
        profileUrl: newUserDetails.profileUrl,
      }))
    );
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: newUserDetails._id,
        username: newUserDetails.username,
        profileUrl: newUserDetails.profileUrl,
      })
    );
    setUser(JSON.parse(localStorage.getItem("user")!));
  };

  /*Edit Profile Modal*/
  const [editProfileModal, setEditProfileModal] = useState(false);

  const profileOpenModal = () => {
    setEditProfileModal(true);
  };
  const profileCloseModal = () => {
    setEditProfileModal(false);
  };

  /* Posts */
  const [postsLoading, setPostsLoading] = useState(false);
  const [postError, setPostError] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

  const [currentPage, setCurrentPage] = useState(1); // Starts at page 1
  const [totalPages, setTotalPages] = useState(1); // Will be updated from API
  const pageSize = 3; // Number of posts per page

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
    console.log("Profile Posts fetch useffect");
    let cancelRequest: () => void;
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        setPostError("");
        const { request, cancel } = postService.getAllPosts(
          user!.id,
          currentPage,
          pageSize
        );
        cancelRequest = cancel;
        const response = await request;
        setTotalPages(response.data.pagination!.totalPages);
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
  }, [currentPage]);

  /* Post Modal */
  const [postModalType, setModalType] = useState<"edit" | "delete" | null>(
    null
  );
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Open close modal function
  const postOpenModal = (type: "edit" | "delete", post?: Post) => {
    setModalType(type);
    setSelectedPost(post || null); // if type is create, post should be null
  };

  // Close post modal function
  const postCloseModal = () => {
    setModalType(null);
    setSelectedPost(null);
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="flex max-w-5xl w-full items-start p-4 space-x-8">
        {/* User Section */}
        {userError && (
          <p className="text-center p-4 text-red-500 bg-red-100 border border-red-200 rounded-lg">
            {userError}
          </p>
        )}
        {userLoading || postsLoading ? (
          <div className="w-full flex justify-center mt-4">
            <Spinner />
          </div>
        ) : (
          <>
            {userDetails && (
              <div className="space-y-4 w-1/4">
                <img
                  src={userDetails.profileUrl}
                  alt={userDetails.username}
                  className="w-full h-72 rounded-sm object-cover"
                />
                <div className="flex items-center space-x-2">
                  <MdPerson className="text-gray-500" />
                  <p className="text-gray-500">{userDetails.username}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <MdEmail className="text-gray-500" />
                  <p className="text-gray-500">{userDetails.email}</p>
                </div>
              </div>
            )}

            {/* Post Section */}

            <div className="space-y-2 w-3/4">
              {postError && (
                <p className="text-center p-4 text-red-500 bg-red-100 border border-red-200 rounded-lg">
                  {postError}
                </p>
              )}
              {userDetails && (
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold ">
                    {userDetails.fname + " " + userDetails.lname}
                  </h2>
                  <button
                    onClick={profileOpenModal}
                    className="text-gray-500 cursor-pointer"
                  >
                    <MdSettings size={24} />
                  </button>
                </div>
              )}
              {posts && (
                <PostList
                  posts={posts}
                  onEdit={(post) => postOpenModal("edit", post)}
                  onDelete={(post) => postOpenModal("delete", post)}
                />
              )}

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/*Post Modal Rendering */}
      {postModalType && (
        <Modal>
          {postModalType === "edit" && (
            <PostEditForm
              post={selectedPost!}
              onClose={postCloseModal}
              onPostEdit={handlePostUpdate}
            />
          )}
          {postModalType === "delete" && (
            <PostDeleteForm
              post={selectedPost!}
              onClose={postCloseModal}
              onPostDelete={handlePostDelete}
            />
          )}
        </Modal>
      )}

      {/*Edit Profile Modal Rendering */}
      {editProfileModal && (
        <Modal>
          <ProfileEditForm
            userDetails={userDetails!}
            onClose={profileCloseModal}
            onProfileEdit={handleProfileEdit}
          />
        </Modal>
      )}
    </div>
  );
};
export default Profile;
