"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const exception_1 = require("./../Common/exception");
const security_enum_1 = require("./../Common/enum/security.enum");
const validation = (schema) => {
    return (req, res, next) => {
        const lang = Number(req.headers["accept-language"] ?? security_enum_1.languageEnum.EN);
        const validationSchema = typeof schema === "function" ? schema(lang) : schema;
        const validationResult = validationSchema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (!validationResult.success) {
            throw new exception_1.BadRequestException("validation error", validationResult.error.issues);
        }
        req.validate = validationResult.data;
        next();
    };
};
exports.validation = validation;
