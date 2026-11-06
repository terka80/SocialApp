import { BadRequestException } from './../Common/exception';
import { languageEnum } from './../Common/enum/security.enum';
import { NextFunction, Request, Response } from 'express';
import { ZodType } from 'zod';
type ValidationSchemaType= (lang:languageEnum)=> ZodType
export const validation = (schema:ValidationSchemaType) => {
  return (req:Request, res:Response, next:NextFunction):void => {
    const lang = Number(req.headers["accept-language"] ?? languageEnum.EN);
    const validationSchema =
      typeof schema === "function" ? schema(lang) : schema;
    const validationResult = validationSchema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
   
    });

    if (!validationResult.success) {
      throw new  BadRequestException("validation error", validationResult.error.issues);
    }
    req.validate = validationResult.data;
    next();
  };
};
