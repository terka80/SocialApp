"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const cloud_service_1 = require("./../../Common/service/cloud.service");
const cache_service_1 = require("./../../Common/service/cache.service");
const domain_exception_1 = require("./../../Common/exception/domain.exception");
const config_1 = require("./../../config");
const token_service_1 = require("./../../Common/service/token.service");
const security_enum_1 = require("./../../Common/enum/security.enum");
const repository_1 = require("../../Common/repository");
class UserService {
    tokenService;
    userRepository;
    cacheService;
    cloudService;
    constructor() {
        this.tokenService = token_service_1.tokenService;
        this.userRepository = new repository_1.UserRepository();
        this.cacheService = cache_service_1.cacheService;
        this.cloudService = cloud_service_1.cloudService;
    }
    async profileImage(file, user) {
        const key = await this.cloudService.uploadAsset({
            file,
            folder: `User/${user._id.toString()}`
        });
        return key;
    }
    async rotateToken(payload, user, issuer) {
        const accessExpiresIn = (payload.iat + config_1.ACCESS_TOKEN_EXPIRES_IN) * 1000;
        const currentDate = Date.now() + 30 * 60000;
        if (currentDate < accessExpiresIn) {
            throw new domain_exception_1.ConflictException("Sorry you can't create a new login credential while current access one is valid on  it's range time ");
        }
        const data = await this.tokenService.createLoginCredentials({ user, issuer });
        await this.tokenService.createRevokeToken({ payload });
        return data;
    }
    async logout(payload, user, { action = security_enum_1.logoutEnum.DEVICE }) {
        switch (action) {
            case security_enum_1.logoutEnum.ALL:
                user.changeCredentialsTime = new Date();
                await user.save();
                await this.cacheService.deleteCache({
                    key: await this.cacheService.keysCache({
                        prefix: this.tokenService.userBaseRevokeTokenKey({ userId: payload.sub }),
                    }),
                });
                break;
            default:
                await this.tokenService.createRevokeToken({ payload });
                break;
        }
        return;
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
