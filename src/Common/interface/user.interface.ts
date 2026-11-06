import { GenderEnum, RoleEnum, ProviderEnum, AccountStatusEnum } from "./../enum/user.enum";
export interface IUser {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  password: string;
  phone?: string;
  DOB?: string;
  confirmEmail?: string;
  image?: string;
  coverImage?: string[];
  gender: GenderEnum;
  role: RoleEnum;
  provider: ProviderEnum;
  changeCredentialsTime?: Date;
  createdAt?: string;
  updatedAt?: string;
  status:AccountStatusEnum;
  changeStatusAt?:Date
}
