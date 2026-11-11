"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_BUCKET_NAME = exports.AWS_REGION = exports.AWS_ACCESS_SECRET_KEY = exports.AWS_ACCESS_KEY_ID = exports.ORIGINS = exports.WEB_CLIENT_ID = exports.APPLICATION_NAME = exports.APP_PASSWORD = exports.APP_EMAIL = exports.REFRESH_TOKEN_EXPIRES_IN = exports.REFRESH_ADMIN_TOKEN_SIGNATURE = exports.REFRESH_USER_TOKEN_SIGNATURE = exports.ACCESS_TOKEN_EXPIRES_IN = exports.ACCESS_ADMIN_TOKEN_SIGNATURE = exports.ACCESS_USER_TOKEN_SIGNATURE = exports.IV_LENGTH = exports.ENC_KEY = exports.REDIS_URI = exports.DB_URI = exports.SALT = exports.PORT = exports.NODE_ENV = void 0;
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
exports.NODE_ENV = process.env.NODE_ENV ?? "development";
(0, dotenv_1.config)({
    path: (0, node_path_1.resolve)(`.env.${exports.NODE_ENV}`),
});
exports.PORT = parseInt(process.env.PORT ?? "9000");
exports.SALT = parseInt(process.env.SALT ?? "12");
exports.DB_URI = process.env.DB_URI;
exports.REDIS_URI = process.env.REDIS_URI;
exports.ENC_KEY = process.env.ENC_KEY;
exports.IV_LENGTH = parseInt(process.env.IV_LENGTH ?? "16");
exports.ACCESS_USER_TOKEN_SIGNATURE = process.env
    .ACCESS_USER_TOKEN_SIGNATURE;
exports.ACCESS_ADMIN_TOKEN_SIGNATURE = process.env
    .ACCESS_ADMIN_TOKEN_SIGNATURE;
exports.ACCESS_TOKEN_EXPIRES_IN = parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN ?? "1800");
exports.REFRESH_USER_TOKEN_SIGNATURE = process.env
    .REFRESH_TOKEN_SIGNATURE;
exports.REFRESH_ADMIN_TOKEN_SIGNATURE = process.env
    .REFRESH_TOKEN_SIGNATURE;
exports.REFRESH_TOKEN_EXPIRES_IN = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? "31536000");
exports.APP_EMAIL = process.env.APP_EMAIL;
exports.APP_PASSWORD = process.env.APP_PASSWORD;
exports.APPLICATION_NAME = process.env.APPLICATION_NAME;
exports.WEB_CLIENT_ID = process.env.WEB_CLIENT_ID?.split(",") || [];
exports.ORIGINS = process.env.Origins?.split(",") || [];
exports.AWS_ACCESS_KEY_ID = process.env
    .AWS_ACCESS_KEY_ID;
exports.AWS_ACCESS_SECRET_KEY = process.env
    .AWS_ACCESS_SECRET_KEY;
exports.AWS_REGION = process.env
    .AWS_REGION;
exports.AWS_BUCKET_NAME = process.env
    .AWS_BUCKET_NAME;
