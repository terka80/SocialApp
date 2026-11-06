import { EmailSubjectEnum } from './../../enum/email.enum';
import { APP_EMAIL, APP_PASSWORD, APPLICATION_NAME } from "../../../config.js";

import nodemailer  from "nodemailer";
import { BadRequestException } from "../../exception/domain.exception.js";
import { string } from 'zod';



export const userEmailKey= ({email, subject}:{email:string, subject:EmailSubjectEnum}):string=>{
  return  `User::${email}::${subject}::OTP`
}

export const userEmailTrailsKey= ({email, subject}:{email:string, subject:EmailSubjectEnum}):string=>{
  return  `${userEmailKey({email, subject})}::Trails`
}

const transporter = nodemailer.createTransport({
    service:'gmail',
  auth: {
    user: APP_EMAIL,
    pass: APP_PASSWORD,
  },
});





export const sendEmail= async ({
    to, 
    subject, 
    cc,
    bcc,
    text,
    html, 
    attachments=[]
}:{
  to?:string[], 
    subject:string, 
    cc?:string[],
    bcc?:string[],
    text?:string,
    html?:string, 
    attachments?:any[]
})=>{


    try {
        if (!to?.length && !bcc?.length&& !cc?.length) {
            throw new BadRequestException(' missing  email recipients')
        }
        if (!html?.length && !text?.length&& !attachments?.length) {
            throw new BadRequestException(' missing  email content')
        }
  const info = await transporter.sendMail({
    from:` '${APPLICATION_NAME} <${APP_EMAIL}>'`, // sender address
    to, // list of recipients
    subject, // subject line
    cc,
    bcc,
    text, // plain text body
    html, // HTML body
    attachments
  });


} catch (err) {
  console.error("Error while sending mail:", err);
}

}