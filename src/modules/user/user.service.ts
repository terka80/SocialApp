import { IFile } from './../../Common/types/multer.types';
import { cloudService, CloudService } from './../../Common/service/cloud.service';
import { cacheService, CacheService } from './../../Common/service/cache.service';
import { ConflictException } from "./../../Common/exception/domain.exception";
import { ACCESS_TOKEN_EXPIRES_IN } from "./../../config";
import { HUser } from "./../../DB/model/user.model";
import {
  jWTpayloadtype,
  tokenService,
  TokenService,
} from "./../../Common/service/token.service";
import { logoutEnum } from "./../../Common/enum/security.enum";
import { UserRepository } from "../../Common/repository";


export class UserService {
  private readonly tokenService: TokenService;
  private readonly userRepository: UserRepository;
  private readonly cacheService: CacheService; 
  private readonly cloudService : CloudService
  constructor() {
    this.tokenService = tokenService;
    this.userRepository = new UserRepository();
    this.cacheService= cacheService
    this.cloudService = cloudService
  }

  async profileImage(file: IFile , user : HUser):Promise<string> {
   const key= await this.cloudService.uploadAsset({
      file,
      folder :`User/${user._id.toString()}`
    })
    return key;
  }
  async rotateToken(payload: jWTpayloadtype, user: HUser, issuer: string) {
    const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
    const currentDate = Date.now() + 30 * 60000;

    if (currentDate < accessExpiresIn) {
      throw new ConflictException(
        "Sorry you can't create a new login credential while current access one is valid on  it's range time ",
      );
    }
    const data = await this.tokenService.createLoginCredentials({ user, issuer });
    await this.tokenService.createRevokeToken({ payload });
    return data;
  }

  async logout(payload:jWTpayloadtype, user:HUser, { action = logoutEnum.DEVICE }:{action:logoutEnum}) {
    switch (action) {
      case logoutEnum.ALL:
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


export const userService = new UserService()