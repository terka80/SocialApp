"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.userSchema = void 0;
const encryption_security_1 = require("./../../Common/security/encryption.security");
const hash_security_1 = require("./../../Common/security/hash.security");
const user_enum_1 = require("./../../Common/enum/user.enum");
const mongoose_1 = __importDefault(require("mongoose"));
exports.userSchema = new mongoose_1.default.Schema({
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
        required: function () {
            return this.provider === user_enum_1.ProviderEnum.SYSTEM;
        },
    },
    phone: String,
    DOB: Date,
    confirmEmail: Date,
    image: String,
    coverImage: [String],
    status: { type: Number, enum: user_enum_1.AccountStatusEnum, default: user_enum_1.AccountStatusEnum.ACTIVE },
    changeStatusAt: Date,
    gender: {
        type: Number,
        enum: user_enum_1.GenderEnum,
        default: user_enum_1.GenderEnum.MALE,
    },
    role: {
        type: Number,
        enum: user_enum_1.RoleEnum,
        default: user_enum_1.RoleEnum.USER,
    },
    provider: {
        type: Number,
        enum: user_enum_1.ProviderEnum,
        default: user_enum_1.ProviderEnum.SYSTEM,
    },
    changeCredentialsTime: Date,
}, {
    strict: true,
    strictQuery: true,
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    autoIndex: true,
});
exports.userSchema
    .virtual("username")
    .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName });
})
    .get(function () {
    return `${this.firstName}  ${this.lastName}`;
});
exports.userSchema.pre('save', async function () {
    console.log('pre_l/ine');
    if (this.isModified('password')) {
        this.password = await (0, hash_security_1.hash)(this.password);
    }
    if (this.isModified('phone')) {
        this.phone = await (0, encryption_security_1.encryption)(this.phone);
    }
});
exports.userSchema.post('save', function (doc) {
    console.log({ doc });
});
exports.userSchema.pre('validate', function () {
    if (this.provider == user_enum_1.ProviderEnum.GOOGLE && this.password) {
        throw new Error('google ac cannot hold pass');
    }
});
exports.userSchema.pre(['findOne', 'find', 'countDocuments'], function () {
    const query = this.getFilter();
    if (query.paranoid != false)
        this.setQuery({ ...query, status: { $ne: user_enum_1.AccountStatusEnum.ARCHIVE } });
});
exports.userSchema.pre(['updateOne', 'updateMany', 'findOneAndUpdate'], function () {
    const query = this.getFilter();
    const update = this.getUpdate();
    if (update.status == user_enum_1.AccountStatusEnum.ACTIVE) {
        this.setQuery({ ...query, status: { $eq: user_enum_1.AccountStatusEnum.ARCHIVE } });
    }
    else if (update.status == user_enum_1.AccountStatusEnum.ARCHIVE) {
        this.setQuery({ ...query, status: { $ne: user_enum_1.AccountStatusEnum.ARCHIVE } });
    }
    if (!update.status && query.paranoid != false) {
        this.setQuery({ ...query, status: { $ne: user_enum_1.AccountStatusEnum.ARCHIVE } });
    }
    this.setUpdate({
        ...this.getUpdate(),
        ...(update.status ? { changeStatusAt: new Date } : {})
    });
});
exports.userSchema.pre(['deleteOne', 'deleteMany', 'findOneAndDelete'], function () {
    const query = this.getFilter();
    if (!query.force) {
        this.setQuery({ ...query, status: { $eq: user_enum_1.AccountStatusEnum.ARCHIVE } });
    }
});
exports.userSchema.pre('insertMany', function (docs) {
});
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model("User", exports.userSchema);
