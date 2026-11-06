import { compare } from "./../security/hash.security";
import { HUser } from "./../../DB/model/user.model";
import { toObjectId } from "./../utils/objectId";
import {
  UnAuthorizedException,
  NotFoundException,
} from "./../exception/domain.exception";
import { tokenTypeEnum } from "./../enum/security.enum";
import { RoleEnum } from "./../enum/user.enum";
import {
  ACCESS_USER_TOKEN_SIGNATURE,
  REFRESH_ADMIN_TOKEN_SIGNATURE,
  ACCESS_ADMIN_TOKEN_SIGNATURE,
  REFRESH_USER_TOKEN_SIGNATURE,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "./../../config";
import { cacheService, CacheService } from "./cache.service";
import { UserRepository } from "../repository";
import mongoose from "mongoose";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { BadRequestException } from "../exception/domain.exception.js";
import { randomUUID } from "node:crypto";
type UserIdType = mongoose.Types.ObjectId | string;
export type jWTpayloadtype = JwtPayload & {
  sub: string;
  aud: number[];
  jti: string;
  iat: number;
};
export class TokenService {
  private readonly userRepository: UserRepository;
  private readonly cacheService: CacheService;

  constructor() {
    this.userRepository = new UserRepository();
    this.cacheService = cacheService;
  }

  userBaseKey({ userId }: { userId: UserIdType }): string {
    return `User::${userId.toString()}`;
  }
  userBaseRevokeTokenKey({ userId }: { userId: UserIdType }): string {
    return `${this.userBaseKey({ userId })}::Revoke_Token`;
  }
  userRevokeTokenKey({
    userId,
    jti,
  }: {
    userId: UserIdType;
    jti: string;
  }): string {
    return `${this.userBaseRevokeTokenKey({ userId })}::${jti}`;
  }

  async generateToken({
    payload,
    options,
    secret = ACCESS_USER_TOKEN_SIGNATURE,
  }: {
    payload: string | Buffer | object;
    secret: Secret;
    options?: SignOptions;
  }): Promise<string> {
    const signingSecret = secret ?? ACCESS_USER_TOKEN_SIGNATURE;
    return jwt.sign(payload, signingSecret, options);
  }

  async verifyToken({
    token = "",
    secret = ACCESS_USER_TOKEN_SIGNATURE,
  }: {
    token: string;
    secret: Secret;
  }): Promise<jWTpayloadtype> {
    const verificationSecret = secret ?? ACCESS_USER_TOKEN_SIGNATURE;
    return jwt.verify(token, verificationSecret) as jWTpayloadtype;
  }

  async getTokenSignature({
    role = RoleEnum.USER,
  }: {
    role: RoleEnum;
  }): Promise<{
    accessSignature: string;
    refreshSignature: string;
  }> {
    let signature: {
      accessSignature: string;
      refreshSignature: string;
    };
    switch (role) {
      case RoleEnum.ADMIN:
        signature = {
          accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE,
          refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE,
        };
        break;

      default:
        signature = {
          accessSignature: ACCESS_USER_TOKEN_SIGNATURE,
          refreshSignature: REFRESH_USER_TOKEN_SIGNATURE,
        };
        break;
    }
    return signature;
  }

  async getSignature({
    tokenType = tokenTypeEnum.ACCESS,
    role = RoleEnum.USER,
  }: {
    tokenType: tokenTypeEnum;
    role?: RoleEnum;
  }): Promise<string> {
    const signatures = await this.getTokenSignature({ role });
    return tokenType == tokenTypeEnum.ACCESS
      ? signatures.accessSignature
      : signatures.refreshSignature;
  }

  async decodeToken({
    authorization,
    tokenType = tokenTypeEnum.ACCESS,
  }: {
    authorization: string;
    tokenType?: tokenTypeEnum;
  }): Promise<{ user: HUser; payload: jWTpayloadtype }> {
    const decoded = jwt.decode(authorization) as jWTpayloadtype;

    const payload = await this.verifyToken({
      token: authorization,
      secret: await this.getSignature({
        tokenType,
        role: decoded.aud[0] as unknown as RoleEnum,
      }),
    });
    if (!payload?.sub) {
      throw new BadRequestException("missing token payload");
    }
    if (
      await this.cacheService.existCache({
        key: this.userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
      })
    ) {
      throw new UnAuthorizedException("Expired login credentials");
    }
    const user = await this.userRepository.findById({
      id: toObjectId(payload.sub),
    });
    if (!user) {
      throw new NotFoundException("Invalid user id");
    }
    if ((user.changeCredentialsTime?.getTime() ?? 0) > payload.iat * 1000) {
      throw new UnAuthorizedException("Expired login credentials");
    }
    return { user, payload };
  }

  async createLoginCredentials({
    user,
    issuer,
  }: {
    user: HUser;
    issuer: string;
  }): Promise<{ access_token: string; refresh_token: string }> {
    const { accessSignature, refreshSignature } = await this.getTokenSignature({
      role: user.role,
    });
    const jwtId = randomUUID();
    const access_token = await this.generateToken({
      payload: { sub: user._id },
      secret: accessSignature,
      options: {
        issuer,
        audience: [user.role as unknown as string],
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
        jwtid: jwtId,
      },
    });
    const refresh_token = await this.generateToken({
      payload: { sub: user._id },
      secret: refreshSignature,
      options: {
        audience: [user.role as unknown as string],
        issuer,

        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
        jwtid: jwtId,
      },
    });
    return { access_token, refresh_token };
  }

  async createRevokeToken({ payload }: { payload: jWTpayloadtype }) {
    const consumedTime = Math.ceil(Date.now() / 1000) - payload.iat;
    const refreshEXpiresIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN;
    const ttl = refreshEXpiresIn - consumedTime;

    await this.cacheService.setCache({
      key: this.userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
      value: payload.jti,
      ttl,
    });
    return;
  }

  async basicAuth({ email, password }: { email: string; password: string }) {
    const account = await this.userRepository.findOne({
      filter: { email },
    });
    if (!account) throw new NotFoundException("Not Exist");
    const match = await compare(password, account.password);
    if (!match) throw new NotFoundException("Not Exist");

    return account;
  }
}

export const tokenService = new TokenService();
