import { Comment } from "../types/commentTypes";
import CommentCard from "./CommentCard";

type CommentListProps = {
  comments: Comment[];
};
const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  return (
    <div className="flex flex-col-reverse">
      {comments.length !== 0 ? (
        comments.map((comment: Comment) => (
          <CommentCard key={comment._id} comment={comment} />
        ))
      ) : (
        <div>No comments to show.</div>
      )}
    </div>
  );
};
export default CommentList;
