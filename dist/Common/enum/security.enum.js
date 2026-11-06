"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutEnum = exports.languageEnum = exports.tokenTypeEnum = void 0;
var tokenTypeEnum;
(function (tokenTypeEnum) {
    tokenTypeEnum[tokenTypeEnum["ACCESS"] = 0] = "ACCESS";
    tokenTypeEnum[tokenTypeEnum["REFRESH"] = 1] = "REFRESH";
})(tokenTypeEnum || (exports.tokenTypeEnum = tokenTypeEnum = {}));
var languageEnum;
(function (languageEnum) {
    languageEnum[languageEnum["EN"] = 0] = "EN";
    languageEnum[languageEnum["AR"] = 1] = "AR";
})(languageEnum || (exports.languageEnum = languageEnum = {}));
var logoutEnum;
(function (logoutEnum) {
    logoutEnum[logoutEnum["DEVICE"] = 0] = "DEVICE";
    logoutEnum[logoutEnum["ALL"] = 1] = "ALL";
})(logoutEnum || (exports.logoutEnum = logoutEnum = {}));
