import { encryption } from './../../Common/security/encryption.security';
import { hash } from './../../Common/security/hash.security';
import { IUser } from './../../Common/interface/user.interface';
import { ProviderEnum, GenderEnum, RoleEnum, AccountStatusEnum } from './../../Common/enum/user.enum';
import mongoose, { HydratedDocument } from "mongoose";

export const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      maxLength: 25,
      minLength: 2,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 25,
      minLength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function ():boolean {
        return this.provider === ProviderEnum.SYSTEM;
      },
    },
    phone: String,
    DOB: Date,
    confirmEmail: Date,
    image: String,
    coverImage: [String],
    status:{type:Number, enum:AccountStatusEnum, default:AccountStatusEnum.ACTIVE},
    changeStatusAt:Date,
    gender: {
      type: Number,
      enum: GenderEnum,
      default: GenderEnum.MALE,
    },
    role: {
      type: Number,
      enum: RoleEnum,
      default: RoleEnum.USER,
    },
    provider: {
      type: Number,
      enum: ProviderEnum,
      default: ProviderEnum.SYSTEM,
    },
    changeCredentialsTime: Date,
  },
  {
    strict: true,
    strictQuery: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    autoIndex: true,
  },
);

userSchema
  .virtual("username")
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
  })
  .get(function () {
    return `${this.firstName}  ${this.lastName}`;
  });





  userSchema.pre('save',async function(){
    console.log('pre_l/ine');
    if (this.isModified('password')) {
    this.password= await hash(this.password)
      
    }
    if (this.isModified('phone')) {
    this.phone= await encryption(this.phone as string)
      
    }

    
  })
  userSchema.post('save', function(doc){
    console.log({doc});
    
  })
userSchema.pre('validate',function(){
  if (this.provider== ProviderEnum.GOOGLE&& this.password) {
    throw new Error('google ac cannot hold pass')
  }
})
  

userSchema.pre(['findOne','find','countDocuments'], function () {
  const query= this.getFilter()
  if (query.paranoid!=false)  this.setQuery({...query,status:{$ne:AccountStatusEnum.ARCHIVE}})

})
userSchema.pre(['updateOne', 'updateMany','findOneAndUpdate'], function () {
  const query= this.getFilter()
    const update=this.getUpdate() as HUser
  if (update.status== AccountStatusEnum.ACTIVE ) {
   this.setQuery({...query,status:{$eq:AccountStatusEnum.ARCHIVE}})
  }else if(update.status== AccountStatusEnum.ARCHIVE){
   this.setQuery({...query,status:{$ne:AccountStatusEnum.ARCHIVE}}) 
  }

  if (!update.status && query.paranoid != false) {
     this.setQuery({...query,status:{$ne:AccountStatusEnum.ARCHIVE}})
  }

    this.setUpdate({
  ...this.getUpdate(),
  ...(update.status ? { changeStatusAt:new Date}:{})
  })

})
userSchema.pre(['deleteOne', 'deleteMany','findOneAndDelete'], function () {
  const query= this.getFilter()


  if (!query.force ) {
     this.setQuery({...query,status:{$eq:AccountStatusEnum.ARCHIVE}})
  }



})

userSchema.pre('insertMany', function (docs:HUser) {
  
})

export const UserModel =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export type HUser=HydratedDocument <IUser>