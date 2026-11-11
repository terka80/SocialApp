"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = exports.CommentService = void 0;
const exception_1 = require("../../Common/exception");
const repository_1 = require("../../Common/repository");
const mongoose_1 = __importDefault(require("mongoose"));
const toCommentId = (id) => {
    if (!mongoose_1.default.isObjectIdOrHexString(id)) {
        throw new exception_1.BadRequestException("Invalid comment ID");
    }
    return new mongoose_1.default.Types.ObjectId(id);
};
class CommentService {
    commentRepository = new repository_1.CommentRepository();
    postRepository = new repository_1.PostRepository();
    async findById(id) {
        const comment = await this.commentRepository.findById({
            id: toCommentId(id),
        });
        if (!comment)
            throw new exception_1.NotFoundException("Comment not found");
        return comment;
    }
    async update(id, content, user) {
        const comment = await this.findById(id);
        if (!comment.owner.equals(user._id)) {
            throw new exception_1.ForBiddenException("Only the comment owner can update it");
        }
        comment.content = content;
        return await comment.save();
    }
    async delete(id, user) {
        const comment = await this.findById(id);
        if (!comment.owner.equals(user._id)) {
            const post = await this.postRepository.findById({ id: comment.post });
            if (!post)
                throw new exception_1.NotFoundException("Post not found");
            if (!post.owner.equals(user._id)) {
                throw new exception_1.ForBiddenException("Only the comment or post owner can delete it");
            }
        }
        await this.commentRepository.deleteOne({ filter: { _id: comment._id } });
    }
}
exports.CommentService = CommentService;
exports.commentService = new CommentService();
