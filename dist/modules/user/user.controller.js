"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const multer_enum_1 = require("./../../Common/enum/multer.enum");
const local_multer_1 = require("./../../Common/utils/multer/local.multer");
const multer_middleware_1 = require("./../../middleware/multer.middleware");
const issuer_1 = require("./../../Common/utils/issuer");
const user_service_1 = require("./user.service");
const security_enum_1 = require("./../../Common/enum/security.enum");
const response_middleware_1 = require("./../../middleware/response.middleware");
const authentication_middleware_1 = require("./../../middleware/authentication.middleware");
const express_1 = require("express");
const router = (0, express_1.Router)({ strict: true, caseSensitive: true });
router.get("/", authentication_middleware_1.authentication, (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    return { data: req.user };
}));
router.patch("/profile-image", (0, multer_middleware_1.uploadMiddleware)({
    multerMiddleware: (0, local_multer_1.localFileUpload)({ storageApproach: multer_enum_1.StorageApproachEnum.DISK }).single('attachment'),
    validation: local_multer_1.fileValidation.image,
    customPath: 'User'
}), authentication_middleware_1.authentication, (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    return { data: req.file };
}));
router.post("/rotate-token", (0, authentication_middleware_1.authentication)(security_enum_1.tokenTypeEnum.REFRESH), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.userService.rotateToken(req.payload, req.user, (0, issuer_1.getIssuer)(req));
    return data;
}));
router.post("/logout", (0, authentication_middleware_1.authentication)(), (0, response_middleware_1.responseFormatter)(async (req, res, next) => {
    const data = await user_service_1.userService.logout(req.payload, req.user, req.body);
    return data;
}));
exports.default = router;
