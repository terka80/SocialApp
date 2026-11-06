"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compare = exports.hash = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_js_1 = require("../../config.js");
const hash = async (plainText, salt_round = config_js_1.SALT, minor = 'b') => {
    const saltSignature = await bcrypt_1.default.genSalt(salt_round, minor);
    const cipherText = await bcrypt_1.default.hash(plainText, saltSignature);
    return cipherText;
};
exports.hash = hash;
const compare = async (plainText, cipherText) => {
    const match = await bcrypt_1.default.compare(plainText, cipherText);
    return match;
};
exports.compare = compare;
