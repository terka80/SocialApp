"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_db_1 = require("./DB/connection.db");
const config_1 = require("./config");
const error_middleware_1 = require("./middleware/error.middleware");
const express_1 = __importDefault(require("express"));
const modules_1 = require("./modules");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
var corsOptions = {
    origin: function (origin, callback) {
        if (!config_1.ORIGINS.includes(origin)) {
            callback(new Error("Unauthorized origin ", { cause: { status: 401 } }), config_1.ORIGINS);
        }
        else {
            callback(null, config_1.ORIGINS);
        }
    },
};
app.use((0, cors_1.default)(), express_1.default.json());
app.use("/assets", express_1.default.static("./assets"));
(0, connection_db_1.bootstrapDB)(app, config_1.PORT);
app.all("/", async (req, res, next) => {
    return res.status(200).json({ message: "done request" });
});
app.use("/auth", modules_1.authenticationController);
app.use("/user", modules_1.userController);
app.use("/post", modules_1.postController);
app.use("/comment", modules_1.commentController);
app.use(error_middleware_1.globalErrorHandling);
