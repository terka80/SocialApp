"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postContent = void 0;
const zod_1 = require("zod");
const postContent = () => zod_1.z.object({
    body: zod_1.z.strictObject({
        content: zod_1.z.string().trim().min(1).max(5000),
    }),
});
exports.postContent = postContent;
