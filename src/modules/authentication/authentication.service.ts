import { WEB_CLIENT_ID } from './../../config';
import { ILoginResponse, ISignupWithGmailResponse } from './entities/authentication.entities';
import { tokenService, TokenService } from './../../Common/service';
import { IUser } from './../../Common/interface/user.interface';
import { ProviderEnum } from './../../Common/enum/user.enum';
import { createOtp } from './../../Common/utils/otp';
import { emailEvent } from './../../Common/utils/email/email.event';
import { userEmailKey, userEmailTrailsKey } from './../../Common/utils/email/send.email';
import { EmailSubjectEnum } from './../../Common/enum/email.enum';
import { compare, hash } from './../../Common/security/hash.security';
import  { CacheService ,cacheService } from './../../Common/service';
import { ConflictException, TooManyRequestException, NotFoundException, BadRequestException } from './../../Common/exception/domain.exception';
import { SignupDto, ConfirmEmailDto, ReSendConfirmEmailDto, LoginDto } from './dto/authentication.dto';
import { UserRepository } from '../../Common/repository';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
export class AuthenticationService{
    private userRepository:UserRepository
    private cacheService:CacheService
    private tokenService:TokenService
    private client :OAuth2Client
    constructor(){
        this.userRepository= new UserRepository()
        this.cacheService= cacheService
        this.tokenService=tokenService
        this.client = new OAuth2Client()
    }

async  verifyGoogleAccount(idToken:string): Promise<TokenPayload> {
  const ticket = await this.client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload?.email_verified) {
    throw new  BadRequestException("email not verified");
  }

  return payload;
}



async  signupWithGmail ({ idToken }:{idToken:string}, issuer:string):Promise<ISignupWithGmailResponse>  {

  const { name, email, picture } = await this.verifyGoogleAccount(idToken);
  const existAccount = await this.userRepository.findOne({
    filter: { email : email as string },
  });
  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw new  ConflictException("invalid account provider");
    }
    return {
      status: 200,
      data: await  this.tokenService.createLoginCredentials({ user: existAccount, issuer }),
    };
  }

  const user = await this.userRepository.createOne({
    data: {
      username: name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image: picture,
    },
  });
  return { status: 201, data: await this.tokenService.createLoginCredentials({ user, issuer }) };
};

    


    async sendEmailOtp  ({
  email,
  subject,
  expiresIn = 120,
  maxTrails = 3,
  blockInSeconds= 300,
  title
}:{
  email:string,
  subject:EmailSubjectEnum,
  expiresIn?:number,
  maxTrails?:number,
  blockInSeconds?:number,
  title?:string
})  {
  const existOtp_ttl = await this.cacheService.ttlCache({
    key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  });
  if (existOtp_ttl > 0) {
    throw new ConflictException(
      `sorry we can't create a new otp while there is a valid ony try again after ${existOtp_ttl}s`,
    );
  }
  const oldTrails =
    (await this.cacheService.getCache({ key: userEmailTrailsKey({ email, subject }) })) ?? 0;
  if (oldTrails >= maxTrails) {
    throw new TooManyRequestException("max otp trails has been reached");
  }
  const code = createOtp();
  await this.cacheService.setCache({
    key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
    value: await hash(code.toString()),
    ttl: expiresIn,
  });
  const currentTrails = await this.cacheService.incrementByCache({
    key: userEmailTrailsKey({ email, subject }),
  });
  if (currentTrails==3) {
    await this.cacheService.expireCache({key:  userEmailTrailsKey({email, subject}), ttl : blockInSeconds})
  }
  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    subject,
    data: { code,title: title??subject },
  });
};

async signup ({ email, password, username ,phone}:SignupDto['body']):Promise<IUser> {
  const duplicatedAccount = await this.userRepository.findOne({
    filter: { email },
    options: { select: "email" },
  });
  if (duplicatedAccount) throw new ConflictException("Email Exist");
  const account = await this.userRepository.createOne({
    data: { email, password, username ,phone},
  });

  await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
  return account;
};
async confirmEmail ({ email, otp }:ConfirmEmailDto):Promise<void>  {
  const account = await this.userRepository.findOne({
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });
  if (!account) throw new  NotFoundException("invalid account");

  const hashOtp = await this.cacheService.getCache({
    key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  });
  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw new  ConflictException("invalid OTP");
  }
  account.confirmEmail = new Date() as unknown as string;
  await account.save();
  await this.cacheService.deleteCache({
    key: await this.cacheService.keysCache({prefix:userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL })}),
  });
  return;
};
async reSendConfirmEmail ({ email }:ReSendConfirmEmailDto):Promise<void>  {
  const account = await this.userRepository.findOne({
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });
  if (!account) throw new  NotFoundException("invalid account");

  await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  return;
};

async login({ email, password }:LoginDto , issuer:string):Promise<ILoginResponse>  {
  const account = await this.userRepository.findOne({
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });
  if (!account) throw new  NotFoundException("Not Exist");
  const match = await compare(password, account.password);
  if (!match) throw new NotFoundException("Not Exist");

  return await this.tokenService.createLoginCredentials({ user: account, issuer });
};

















}
export default new AuthenticationService() 