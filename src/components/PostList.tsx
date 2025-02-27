import { Post } from "../types/postTypes";
import PostCard from "./PostCard";
import { useEffect } from "react";

type PostListProps = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

const PostList: React.FC<PostListProps> = ({ posts, onEdit, onDelete }) => {
  console.log("PostList render");

  useEffect(() => {
    console.log("PostList mounted");
  }, []);

  return (
    <div className="flex flex-col-reverse space-y-reverse space-y-4 ">
      {posts.length !== 0 ? (
        posts.map((post: Post) => (
          <PostCard
            key={post._id}
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      ) : (
        <div>No posts to show</div>
      )}
    </div>
  );
};
export default PostList;
