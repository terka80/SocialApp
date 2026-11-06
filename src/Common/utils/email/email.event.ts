import { EmailSubjectEnum } from "./../../enum/email.enum";
import { EventEmitter } from "node:events";
import { sendEmail } from "./send.email";
import { verifyEmailTemplate } from "./email.templates";

export const emailEvent = new EventEmitter();

emailEvent.on(
  "sendEmail",
  async ({
    recipients,
    subject = EmailSubjectEnum.CONFIRM_EMAIL,
    data,
  }: {
    subject?: EmailSubjectEnum;
    recipients: { to?: string[]; cc?: string[]; bcc?: string[] };
    data: any;
  }) => {
    try {
      await sendEmail({
        ...recipients,
        subject,
        html: verifyEmailTemplate({
          code: data.code,
          subject,
          title: data.title ?? subject,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  },
);
