"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const post_model_1 = require("../../DB/model/post.model");
const base_repository_1 = require("./base.repository");
class PostRepository extends base_repository_1.DataBaseRepository {
    constructor() {
        super(post_model_1.PostModel);
    }
}
exports.PostRepository = PostRepository;
