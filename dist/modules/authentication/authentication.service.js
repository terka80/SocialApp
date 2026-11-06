"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const config_1 = require("./../../config");
const service_1 = require("./../../Common/service");
const user_enum_1 = require("./../../Common/enum/user.enum");
const otp_1 = require("./../../Common/utils/otp");
const email_event_1 = require("./../../Common/utils/email/email.event");
const send_email_1 = require("./../../Common/utils/email/send.email");
const email_enum_1 = require("./../../Common/enum/email.enum");
const hash_security_1 = require("./../../Common/security/hash.security");
const service_2 = require("./../../Common/service");
const domain_exception_1 = require("./../../Common/exception/domain.exception");
const repository_1 = require("../../Common/repository");
const google_auth_library_1 = require("google-auth-library");
class AuthenticationService {
    userRepository;
    cacheService;
    tokenService;
    client;
    constructor() {
        this.userRepository = new repository_1.UserRepository();
        this.cacheService = service_2.cacheService;
        this.tokenService = service_1.tokenService;
        this.client = new google_auth_library_1.OAuth2Client();
    }
    async verifyGoogleAccount(idToken) {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: config_1.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new domain_exception_1.BadRequestException("email not verified");
        }
        return payload;
    }
    async signupWithGmail({ idToken }, issuer) {
        const { name, email, picture } = await this.verifyGoogleAccount(idToken);
        const existAccount = await this.userRepository.findOne({
            filter: { email: email },
        });
        if (existAccount) {
            if (existAccount.provider != user_enum_1.ProviderEnum.GOOGLE) {
                throw new domain_exception_1.ConflictException("invalid account provider");
            }
            return {
                status: 200,
                data: await this.tokenService.createLoginCredentials({ user: existAccount, issuer }),
            };
        }
        const user = await this.userRepository.createOne({
            data: {
                username: name,
                email,
                confirmEmail: new Date(),
                provider: user_enum_1.ProviderEnum.GOOGLE,
                image: picture,
            },
        });
        return { status: 201, data: await this.tokenService.createLoginCredentials({ user, issuer }) };
    }
    ;
    async sendEmailOtp({ email, subject, expiresIn = 120, maxTrails = 3, blockInSeconds = 300, title }) {
        const existOtp_ttl = await this.cacheService.ttlCache({
            key: (0, send_email_1.userEmailKey)({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL }),
        });
        if (existOtp_ttl > 0) {
            throw new domain_exception_1.ConflictException(`sorry we can't create a new otp while there is a valid ony try again after ${existOtp_ttl}s`);
        }
        const oldTrails = (await this.cacheService.getCache({ key: (0, send_email_1.userEmailTrailsKey)({ email, subject }) })) ?? 0;
        if (oldTrails >= maxTrails) {
            throw new domain_exception_1.TooManyRequestException("max otp trails has been reached");
        }
        const code = (0, otp_1.createOtp)();
        await this.cacheService.setCache({
            key: (0, send_email_1.userEmailKey)({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL }),
            value: await (0, hash_security_1.hash)(code.toString()),
            ttl: expiresIn,
        });
        const currentTrails = await this.cacheService.incrementByCache({
            key: (0, send_email_1.userEmailTrailsKey)({ email, subject }),
        });
        if (currentTrails == 3) {
            await this.cacheService.expireCache({ key: (0, send_email_1.userEmailTrailsKey)({ email, subject }), ttl: blockInSeconds });
        }
        email_event_1.emailEvent.emit("sendEmail", {
            recipients: { to: email },
            subject,
            data: { code, title: title ?? subject },
        });
    }
    ;
    async signup({ email, password, username, phone }) {
        const duplicatedAccount = await this.userRepository.findOne({
            filter: { email },
            options: { select: "email" },
        });
        if (duplicatedAccount)
            throw new domain_exception_1.ConflictException("Email Exist");
        const account = await this.userRepository.createOne({
            data: { email, password, username, phone },
        });
        await this.sendEmailOtp({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL });
        return account;
    }
    ;
    async confirmEmail({ email, otp }) {
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provider: user_enum_1.ProviderEnum.SYSTEM,
                confirmEmail: { $exists: false },
            },
        });
        if (!account)
            throw new domain_exception_1.NotFoundException("invalid account");
        const hashOtp = await this.cacheService.getCache({
            key: (0, send_email_1.userEmailKey)({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL }),
        });
        if (!hashOtp || !(await (0, hash_security_1.compare)(otp, hashOtp))) {
            throw new domain_exception_1.ConflictException("invalid OTP");
        }
        account.confirmEmail = new Date();
        await account.save();
        await this.cacheService.deleteCache({
            key: await this.cacheService.keysCache({ prefix: (0, send_email_1.userEmailKey)({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL }) }),
        });
        return;
    }
    ;
    async reSendConfirmEmail({ email }) {
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provider: user_enum_1.ProviderEnum.SYSTEM,
                confirmEmail: { $exists: false },
            },
        });
        if (!account)
            throw new domain_exception_1.NotFoundException("invalid account");
        await this.sendEmailOtp({ email, subject: email_enum_1.EmailSubjectEnum.CONFIRM_EMAIL });
        return;
    }
    ;
    async login({ email, password }, issuer) {
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provider: user_enum_1.ProviderEnum.SYSTEM,
                confirmEmail: { $exists: true },
            },
        });
        if (!account)
            throw new domain_exception_1.NotFoundException("Not Exist");
        const match = await (0, hash_security_1.compare)(password, account.password);
        if (!match)
            throw new domain_exception_1.NotFoundException("Not Exist");
        return await this.tokenService.createLoginCredentials({ user: account, issuer });
    }
    ;
}
exports.AuthenticationService = AuthenticationService;
exports.default = new AuthenticationService();
