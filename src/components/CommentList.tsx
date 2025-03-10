import { Comment } from "../types/commentTypes";
import CommentCard from "./CommentCard";

type CommentListProps = {
  comments: Comment[];
  onCommentEdit: (editedComment: Comment) => void;
  onCommentDelete: (deletedCommentId: string) => void;
};
const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentEdit,
  onCommentDelete,
}) => {
  console.log("Commentlist rendered");
  return (
    <div className="flex flex-col mb-4">
      {comments.length !== 0 ? (
        comments.map((comment: Comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            onCommentEdit={onCommentEdit}
            onCommentDelete={onCommentDelete}
          />
        ))
      ) : (
        <div>No comments to show.</div>
      )}
    </div>
  );
};
export default CommentList;
