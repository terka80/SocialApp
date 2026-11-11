"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postService = exports.PostService = void 0;
const exception_1 = require("../../Common/exception");
const repository_1 = require("../../Common/repository");
const mongoose_1 = __importDefault(require("mongoose"));
const toPostId = (id) => {
    if (!mongoose_1.default.isObjectIdOrHexString(id)) {
        throw new exception_1.BadRequestException("Invalid post ID");
    }
    return new mongoose_1.default.Types.ObjectId(id);
};
class PostService {
    postRepository = new repository_1.PostRepository();
    commentRepository = new repository_1.CommentRepository();
    async create(content, user) {
        return await this.postRepository.createOne({
            data: { content, owner: user._id },
        });
    }
    async findMine(user) {
        return await this.postRepository.find({
            filter: { owner: user._id },
            options: { sort: { createdAt: -1 } },
        });
    }
    async findById(id) {
        const post = await this.postRepository.findById({ id: toPostId(id) });
        if (!post)
            throw new exception_1.NotFoundException("Post not found");
        return post;
    }
    async update(id, content, user) {
        const post = await this.findById(id);
        if (!post.owner.equals(user._id)) {
            throw new exception_1.ForBiddenException("Only the post owner can update it");
        }
        post.content = content;
        return await post.save();
    }
    async delete(id, user) {
        const post = await this.findById(id);
        if (!post.owner.equals(user._id)) {
            throw new exception_1.ForBiddenException("Only the post owner can delete it");
        }
        await this.commentRepository.deleteMany({ filter: { post: post._id } });
        await post.deleteOne();
    }
    async findComments(postId) {
        const post = await this.findById(postId);
        return await this.commentRepository.find({
            filter: { post: post._id },
            options: { sort: { createdAt: -1 } },
        });
    }
    async createComment(postId, content, user) {
        const post = await this.findById(postId);
        return await this.commentRepository.createOne({
            data: { content, post: post._id, owner: user._id },
        });
    }
}
exports.PostService = PostService;
exports.postService = new PostService();
