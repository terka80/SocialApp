import { confirmEmail, login, resendConfirmEmail, signup } from './../authentication.validation';
import {z} from "zod";
// export interface ISignupDto {
//     username:string;
//     email: string ;
//     phone:string;
//     password: string;
//     confirmPassword: string
// }


export type SignupDto = z.infer<ReturnType<typeof signup>>
export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
export type ReSendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']
export type LoginDto = z.infer<ReturnType<typeof login>>['body']
