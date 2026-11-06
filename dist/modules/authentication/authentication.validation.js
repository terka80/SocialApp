"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetForgotPassword = exports.resendConfirmEmail = exports.confirmEmail = exports.signup = exports.login = void 0;
const validation_1 = require("./../../Common/utils/validation");
const enum_1 = require("./../../Common/enum");
const zod_1 = require("zod");
const loginSchema = (lang) => zod_1.z.object({
    email: validation_1.generalValidationFields.email(lang),
    password: validation_1.generalValidationFields.password(lang),
});
const login = (lang) => zod_1.z.object({
    body: loginSchema(lang),
    query: zod_1.z.strictObject({
        lang: zod_1.z.enum(["en", "ar"]).default("en"),
        darkMode: zod_1.z.stringbool().default(false),
    }),
});
exports.login = login;
const signup = (lang) => {
    return zod_1.z.object({
        body: loginSchema(lang)
            .safeExtend({
            username: validation_1.generalValidationFields.username(lang),
            phone: validation_1.generalValidationFields.phone(lang),
            gender: validation_1.generalValidationFields.gender(lang),
            confirmPassword: validation_1.generalValidationFields.password(lang),
        })
            .superRefine((data, ctx) => {
            validation_1.generalValidationFields.matchFields({
                original: "password",
                copy: "confirmPassword",
                data,
                ctx,
                lang,
            });
            if (data.password != data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    path: ["confirmPassword"],
                    message: lang == enum_1.languageEnum.AR
                        ? "عفوا لا يمكن أن يكون كلمة المرور غير متطابقة مع تأكيد كلمة المرور"
                        : 'password not matched with it"s conform one',
                });
            }
        }),
    });
};
exports.signup = signup;
const confirmEmail = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            email: validation_1.generalValidationFields.email(lang),
            otp: validation_1.generalValidationFields.otp(lang),
        }),
    });
};
exports.confirmEmail = confirmEmail;
const resendConfirmEmail = (lang) => {
    return zod_1.z.object({
        body: zod_1.z.strictObject({
            email: validation_1.generalValidationFields.email(lang),
        }),
    });
};
exports.resendConfirmEmail = resendConfirmEmail;
const resetForgotPassword = (lang) => {
    return zod_1.z.object({
        body: zod_1.z
            .strictObject({
            email: validation_1.generalValidationFields.email(lang),
            otp: validation_1.generalValidationFields.otp(lang),
            password: validation_1.generalValidationFields.password(lang),
            confirmPassword: validation_1.generalValidationFields.password(lang),
        })
            .superRefine((data, ctx) => {
            validation_1.generalValidationFields.matchFields({
                original: "password",
                copy: "confirmPassword",
                data,
                ctx,
                lang,
            });
        }),
    });
};
exports.resetForgotPassword = resetForgotPassword;
