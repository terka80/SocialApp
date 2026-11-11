"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const response_middleware_1 = require("../../middleware/response.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const express_1 = require("express");
const comment_validation_1 = require("../comment/comment.validation");
const post_service_1 = require("./post.service");
const post_validation_1 = require("./post.validation");
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.post("/", (0, authentication_middleware_1.authentication)(), (0, validation_middleware_1.validation)(post_validation_1.postContent), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.create(req.validate.body.content, req.user);
    return { status: 201, data };
}));
router.get("/", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.findMine(req.user);
    return { data };
}));
router.post("/:postId/comments", (0, authentication_middleware_1.authentication)(), (0, validation_middleware_1.validation)(comment_validation_1.commentContent), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.createComment(req.params.postId, req.validate.body.content, req.user);
    return { status: 201, data };
}));
router.get("/:postId/comments", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.findComments(req.params.postId);
    return { data };
}));
router.get("/:postId", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.findById(req.params.postId);
    return { data };
}));
router.patch("/:postId", (0, authentication_middleware_1.authentication)(), (0, validation_middleware_1.validation)(post_validation_1.postContent), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await post_service_1.postService.update(req.params.postId, req.validate.body.content, req.user);
    return { data };
}));
router.delete("/:postId", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    await post_service_1.postService.delete(req.params.postId, req.user);
    return { data: { deleted: true } };
}));
exports.default = router;
