import { Post } from "../types/postTypes";
import PostCard from "./PostCard";
import { useEffect } from "react";

const PostList = ({
  posts,
  onEdit,
  onDelete,
}: {
  posts: Post[];
  onEdit: any;
  onDelete: any;
}) => {
  console.log("PostList render");

  useEffect(() => {
    console.log("PostList mounted");
  }, []);

  return (
    <div className="flex flex-col-reverse items-center space-y-4 w-full">
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
        <div className="text-center mt-4 text-lg font-semibold w-full">
          No posts to show
        </div>
      )}
    </div>
  );
};
export default PostList;
