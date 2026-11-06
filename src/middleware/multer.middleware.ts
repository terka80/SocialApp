import { NextFunction, Request, RequestHandler, Response } from 'express';
import { processMulterUpload } from '../Common/utils/multer';

export const uploadMiddleware = ({
  isRequired=true,
  multerMiddleware,
  customPath = "general",
  validation = [],
}:{
   isRequired?:boolean,
  multerMiddleware:RequestHandler,
  customPath ?:string,
  validation:string[],
}) => {
  return (req:Request, res:Response, next:NextFunction) => {
    multerMiddleware(req, res, async (error?:any) => {
      if (error) {
        next(new Error(error.message, { cause: { status: 400 } }));
        return;
      }
      try {
        
        await processMulterUpload({ customPath, validation, req,isRequired  });
        next();
      } catch (error:any) {
        next(new Error(error.message, { cause: { status: 400 } }));
      }
    });
  };
};