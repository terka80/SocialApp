import { generalValidationFields } from "./../../Common/utils/validation";
import { languageEnum } from "./../../Common/enum";
import { z } from "zod";

const loginSchema = (lang: languageEnum) =>
  z.object({
    email: generalValidationFields.email(lang),
    password: generalValidationFields.password(lang),
  });

export const login = (lang: languageEnum) =>
  z.object({
    body: loginSchema(lang),
    query: z.strictObject({
      lang: z.enum(["en", "ar"]).default("en"),
      darkMode: z.stringbool().default(false),
    }),
  });

export const signup = (lang: languageEnum) => {
  return z.object({
    body: loginSchema(lang)
      .safeExtend({
        username: generalValidationFields.username(lang),
        phone: generalValidationFields.phone(lang),
        gender: generalValidationFields.gender(lang),
        confirmPassword: generalValidationFields.password(lang),
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchFields({
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
            message:
              lang == languageEnum.AR
                ? "عفوا لا يمكن أن يكون كلمة المرور غير متطابقة مع تأكيد كلمة المرور"
                : 'password not matched with it"s conform one',
          });
        }
      }),
  });
};

export const confirmEmail = (lang: languageEnum) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
      otp: generalValidationFields.otp(lang),
    }),
  });
};

export const resendConfirmEmail = (lang: languageEnum) => {
  return z.object({
    body: z.strictObject({
      email: generalValidationFields.email(lang),
    }),
  });
};
export const resetForgotPassword = (lang: languageEnum) => {
  return z.object({
    body: z
      .strictObject({
        email: generalValidationFields.email(lang),
        otp: generalValidationFields.otp(lang),
        password: generalValidationFields.password(lang),
        confirmPassword: generalValidationFields.password(lang),
      })
      .superRefine((data, ctx) => {
        generalValidationFields.matchFields({
          original: "password",
          copy: "confirmPassword",
          data,
          ctx,
          lang,
        });
      }),
  });
};
