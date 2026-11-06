"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalValidationFields = void 0;
const user_enum_1 = require("./../enum/user.enum");
const security_enum_1 = require("./../enum/security.enum");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const matchFields = ({ original, copy, data, ctx, lang }) => {
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang == security_enum_1.languageEnum.AR
                ? `عفوا لا يمكن أن يكون ${original} أقل من ${copy}`
                : `fail to match ${original} with ${copy}`,
        });
    }
};
exports.generalValidationFields = {
    email: (lang) => zod_1.z.email({
        message: "please enter a valid email like : example@domain.com",
    }),
    password: (lang) => zod_1.z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .min(8)
        .max(16),
    username: (lang) => zod_1.z
        .string()
        .min(2, {
        message: lang === security_enum_1.languageEnum.AR
            ? "عفوا لا يمكن أن يكون اسم المستخدم أقل من 2 أحرف"
            : "username must be at least 2 characters long",
    })
        .max(25, { message: "username must be at most 25 characters long" }),
    phone: (lang) => zod_1.z.e164(),
    confirmPassword: (lang) => zod_1.z.string().min(8).max(16),
    gender: (lang) => zod_1.z.enum(user_enum_1.GenderEnum),
    otp: (lang) => zod_1.z.string().regex(/^\d{6}$/, { error: "invalid code" }),
    id: (lang) => zod_1.z.string().refine((data) => {
        return mongoose_1.default.Types.ObjectId.isValid(data);
    }, { message: "Invalid format " }),
    file: (lang) => zod_1.z.strictObject({
        fieldname: zod_1.z.string(),
        originalname: zod_1.z.string(),
        encoding: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        buffer: zod_1.z.instanceof(Buffer),
        size: zod_1.z.number(),
        path: zod_1.z.string(),
    }),
    matchFields,
};
