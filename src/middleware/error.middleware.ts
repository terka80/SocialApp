import { IError } from './../Common/interface';
import type{ NextFunction, Request, Response } from "express"



export const globalErrorHandling=(error:IError,req:Request,res:Response,next:NextFunction):Response=>{
    const status = error.status ?? 500
    return res.status(status).json({
        status,
        error_message:error.message||'server error',
        error,
        cause:error.cause,
        stack:error.stack
    })
}
