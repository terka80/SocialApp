import { IComment } from "../../Common/interface/comment.interface";
import mongoose, { HydratedDocument } from "mongoose";

const commentSchema = new mongoose.Schema<IComment>(
  {
    content: { type: String, required: true, trim: true, maxLength: 2000 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const CommentModel: mongoose.Model<IComment> =
  (mongoose.models.Comment as mongoose.Model<IComment> | undefined) ??
  mongoose.model<IComment>("Comment", commentSchema);
export type HComment = HydratedDocument<IComment>;
