import { UserModel } from './../../DB/model/user.model';
import { IUser } from './../interface/user.interface';
import { AnyKeys, CreateOptions, HydratedDocument, Model } from "mongoose";
import { DataBaseRepository } from './base.repository';

export  class UserRepository extends DataBaseRepository<IUser> {
  constructor() {
    super(UserModel)
  }


}
