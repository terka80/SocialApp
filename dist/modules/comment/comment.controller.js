"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_middleware_1 = require("../../middleware/authentication.middleware");
const response_middleware_1 = require("../../middleware/response.middleware");
const validation_middleware_1 = require("../../middleware/validation.middleware");
const express_1 = require("express");
const comment_service_1 = require("./comment.service");
const comment_validation_1 = require("./comment.validation");
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.get("/:commentId", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.commentService.findById(req.params.commentId);
    return { data };
}));
router.patch("/:commentId", (0, authentication_middleware_1.authentication)(), (0, validation_middleware_1.validation)(comment_validation_1.commentContent), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await comment_service_1.commentService.update(req.params.commentId, req.validate.body.content, req.user);
    return { data };
}));
router.delete("/:commentId", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    await comment_service_1.commentService.delete(req.params.commentId, req.user);
    return { data: { deleted: true } };
}));
exports.default = router;
