"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.userEmailTrailsKey = exports.userEmailKey = void 0;
const config_js_1 = require("../../../config.js");
const nodemailer_1 = __importDefault(require("nodemailer"));
const domain_exception_js_1 = require("../../exception/domain.exception.js");
const userEmailKey = ({ email, subject }) => {
    return `User::${email}::${subject}::OTP`;
};
exports.userEmailKey = userEmailKey;
const userEmailTrailsKey = ({ email, subject }) => {
    return `${(0, exports.userEmailKey)({ email, subject })}::Trails`;
};
exports.userEmailTrailsKey = userEmailTrailsKey;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: config_js_1.APP_EMAIL,
        pass: config_js_1.APP_PASSWORD,
    },
});
const sendEmail = async ({ to, subject, cc, bcc, text, html, attachments = [] }) => {
    try {
        if (!to?.length && !bcc?.length && !cc?.length) {
            throw new domain_exception_js_1.BadRequestException(' missing  email recipients');
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new domain_exception_js_1.BadRequestException(' missing  email content');
        }
        const info = await transporter.sendMail({
            from: ` '${config_js_1.APPLICATION_NAME} <${config_js_1.APP_EMAIL}>'`,
            to,
            subject,
            cc,
            bcc,
            text,
            html,
            attachments
        });
    }
    catch (err) {
        console.error("Error while sending mail:", err);
    }
};
exports.sendEmail = sendEmail;
