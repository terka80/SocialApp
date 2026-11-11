import {
  ForBiddenException,
  NotFoundException,
  BadRequestException,
} from "../../Common/exception";
import { CommentRepository, PostRepository } from "../../Common/repository";
import { HUser } from "../../DB/model/user.model";
import mongoose from "mongoose";

const toPostId = (id: string): mongoose.Types.ObjectId => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    throw new BadRequestException("Invalid post ID");
  }
  return new mongoose.Types.ObjectId(id);
};

export class PostService {
  private readonly postRepository = new PostRepository();
  private readonly commentRepository = new CommentRepository();

  async create(content: string, user: HUser) {
    return await this.postRepository.createOne({
      data: { content, owner: user._id },
    });
  }

  async findMine(user: HUser) {
    return await this.postRepository.find({
      filter: { owner: user._id },
      options: { sort: { createdAt: -1 } },
    });
  }

  async findById(id: string) {
    const post = await this.postRepository.findById({ id: toPostId(id) });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  async update(id: string, content: string, user: HUser) {
    const post = await this.findById(id);
    if (!post.owner.equals(user._id)) {
      throw new ForBiddenException("Only the post owner can update it");
    }
    post.content = content;
    return await post.save();
  }

  async delete(id: string, user: HUser) {
    const post = await this.findById(id);
    if (!post.owner.equals(user._id)) {
      throw new ForBiddenException("Only the post owner can delete it");
    }
    await this.commentRepository.deleteMany({ filter: { post: post._id } });
    await post.deleteOne();
  }

  async findComments(postId: string) {
    const post = await this.findById(postId);
    return await this.commentRepository.find({
      filter: { post: post._id },
      options: { sort: { createdAt: -1 } },
    });
  }

  async createComment(postId: string, content: string, user: HUser) {
    const post = await this.findById(postId);
    return await this.commentRepository.createOne({
      data: { content, post: post._id, owner: user._id },
    });
  }
}

export const postService = new PostService();
