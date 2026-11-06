"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenService = exports.TokenService = void 0;
const hash_security_1 = require("./../security/hash.security");
const objectId_1 = require("./../utils/objectId");
const domain_exception_1 = require("./../exception/domain.exception");
const security_enum_1 = require("./../enum/security.enum");
const user_enum_1 = require("./../enum/user.enum");
const config_1 = require("./../../config");
const cache_service_1 = require("./cache.service");
const repository_1 = require("../repository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const domain_exception_js_1 = require("../exception/domain.exception.js");
const node_crypto_1 = require("node:crypto");
class TokenService {
    userRepository;
    cacheService;
    constructor() {
        this.userRepository = new repository_1.UserRepository();
        this.cacheService = cache_service_1.cacheService;
    }
    userBaseKey({ userId }) {
        return `User::${userId.toString()}`;
    }
    userBaseRevokeTokenKey({ userId }) {
        return `${this.userBaseKey({ userId })}::Revoke_Token`;
    }
    userRevokeTokenKey({ userId, jti, }) {
        return `${this.userBaseRevokeTokenKey({ userId })}::${jti}`;
    }
    async generateToken({ payload, options, secret = config_1.ACCESS_USER_TOKEN_SIGNATURE, }) {
        const signingSecret = secret ?? config_1.ACCESS_USER_TOKEN_SIGNATURE;
        return jsonwebtoken_1.default.sign(payload, signingSecret, options);
    }
    async verifyToken({ token = "", secret = config_1.ACCESS_USER_TOKEN_SIGNATURE, }) {
        const verificationSecret = secret ?? config_1.ACCESS_USER_TOKEN_SIGNATURE;
        return jsonwebtoken_1.default.verify(token, verificationSecret);
    }
    async getTokenSignature({ role = user_enum_1.RoleEnum.USER, }) {
        let signature;
        switch (role) {
            case user_enum_1.RoleEnum.ADMIN:
                signature = {
                    accessSignature: config_1.ACCESS_ADMIN_TOKEN_SIGNATURE,
                    refreshSignature: config_1.REFRESH_ADMIN_TOKEN_SIGNATURE,
                };
                break;
            default:
                signature = {
                    accessSignature: config_1.ACCESS_USER_TOKEN_SIGNATURE,
                    refreshSignature: config_1.REFRESH_USER_TOKEN_SIGNATURE,
                };
                break;
        }
        return signature;
    }
    async getSignature({ tokenType = security_enum_1.tokenTypeEnum.ACCESS, role = user_enum_1.RoleEnum.USER, }) {
        const signatures = await this.getTokenSignature({ role });
        return tokenType == security_enum_1.tokenTypeEnum.ACCESS
            ? signatures.accessSignature
            : signatures.refreshSignature;
    }
    async decodeToken({ authorization, tokenType = security_enum_1.tokenTypeEnum.ACCESS, }) {
        const decoded = jsonwebtoken_1.default.decode(authorization);
        const payload = await this.verifyToken({
            token: authorization,
            secret: await this.getSignature({
                tokenType,
                role: decoded.aud[0],
            }),
        });
        if (!payload?.sub) {
            throw new domain_exception_js_1.BadRequestException("missing token payload");
        }
        if (await this.cacheService.existCache({
            key: this.userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
        })) {
            throw new domain_exception_1.UnAuthorizedException("Expired login credentials");
        }
        const user = await this.userRepository.findById({
            id: (0, objectId_1.toObjectId)(payload.sub),
        });
        if (!user) {
            throw new domain_exception_1.NotFoundException("Invalid user id");
        }
        if ((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat * 1000) {
            throw new domain_exception_1.UnAuthorizedException("Expired login credentials");
        }
        return { user, payload };
    }
    async createLoginCredentials({ user, issuer, }) {
        const { accessSignature, refreshSignature } = await this.getTokenSignature({
            role: user.role,
        });
        const jwtId = (0, node_crypto_1.randomUUID)();
        const access_token = await this.generateToken({
            payload: { sub: user._id },
            secret: accessSignature,
            options: {
                issuer,
                audience: [user.role],
                expiresIn: config_1.ACCESS_TOKEN_EXPIRES_IN,
                jwtid: jwtId,
            },
        });
        const refresh_token = await this.generateToken({
            payload: { sub: user._id },
            secret: refreshSignature,
            options: {
                audience: [user.role],
                issuer,
                expiresIn: config_1.REFRESH_TOKEN_EXPIRES_IN,
                jwtid: jwtId,
            },
        });
        return { access_token, refresh_token };
    }
    async createRevokeToken({ payload }) {
        const consumedTime = Math.ceil(Date.now() / 1000) - payload.iat;
        const refreshEXpiresIn = payload.iat + config_1.REFRESH_TOKEN_EXPIRES_IN;
        const ttl = refreshEXpiresIn - consumedTime;
        await this.cacheService.setCache({
            key: this.userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
            value: payload.jti,
            ttl,
        });
        return;
    }
    async basicAuth({ email, password }) {
        const account = await this.userRepository.findOne({
            filter: { email },
        });
        if (!account)
            throw new domain_exception_1.NotFoundException("Not Exist");
        const match = await (0, hash_security_1.compare)(password, account.password);
        if (!match)
            throw new domain_exception_1.NotFoundException("Not Exist");
        return account;
    }
}
exports.TokenService = TokenService;
exports.tokenService = new TokenService();
