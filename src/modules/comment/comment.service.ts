import {
  BadRequestException,
  ForBiddenException,
  NotFoundException,
} from "../../Common/exception";
import { CommentRepository, PostRepository } from "../../Common/repository";
import { HUser } from "../../DB/model/user.model";
import mongoose from "mongoose";

const toCommentId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new BadRequestException("Invalid comment ID");
  }
  return new mongoose.Types.ObjectId(id);
};

export class CommentService {
  private readonly commentRepository = new CommentRepository();
  private readonly postRepository = new PostRepository();

  async findById(id: string) {
    const comment = await this.commentRepository.findById({
      id: toCommentId(id),
    });
    if (!comment) throw new NotFoundException("Comment not found");
    return comment;
  }

  async update(id: string, content: string, user: HUser) {
    const comment = await this.findById(id);
    if (!comment.owner.equals(user._id)) {
      throw new ForBiddenException("Only the comment owner can update it");
    }
    comment.content = content;
    return await comment.save();
  }

  async delete(id: string, user: HUser) {
    const comment = await this.findById(id);
    if (!comment.owner.equals(user._id)) {
      const post = await this.postRepository.findById({ id: comment.post });
      if (!post) throw new NotFoundException("Post not found");
      if (!post.owner.equals(user._id)) {
        throw new ForBiddenException(
          "Only the comment or post owner can delete it",
        );
      }
    }
    await this.commentRepository.deleteOne({ filter: { _id: comment._id } });
  }
}

export const commentService = new CommentService();
