"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_js_1 = require("../../config.js");
const encryption = async (plaintext) => {
    const iv = node_crypto_1.default.randomBytes(config_js_1.IV_LENGTH);
    const cipher = node_crypto_1.default.createCipheriv("aes-256-cbc", config_js_1.ENC_KEY, iv);
    let encryptedData = cipher.update(plaintext, "utf-8", "hex");
    encryptedData += cipher.final("hex");
    return `${iv}::${encryptedData}`;
};
exports.encryption = encryption;
const decryption = async (encryptedData) => {
    const [iv, encryptedText] = encryptedData.split("::");
    const binaryLikeIv = Buffer.from(iv, "hex");
    const decipher = node_crypto_1.default.createDecipheriv('aes-256-cbc', config_js_1.ENC_KEY, binaryLikeIv);
    let decryptedData = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedData += decipher.final('utf-8');
    return decryptedData;
};
exports.decryption = decryption;
