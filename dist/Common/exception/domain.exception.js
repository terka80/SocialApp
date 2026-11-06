"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestException = exports.ConflictException = exports.ForBiddenException = exports.UnAuthorizedException = exports.NotFoundException = exports.BadRequestException = void 0;
const application_exception_1 = require("./application.exception");
class BadRequestException extends application_exception_1.ApplicationException {
    constructor(message = "Bad Request", cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends application_exception_1.ApplicationException {
    constructor(message = "Not Found", cause) {
        super(message, 404, cause);
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends application_exception_1.ApplicationException {
    constructor(message = "UnAuthorized", cause) {
        super(message, 401, cause);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
class ForBiddenException extends application_exception_1.ApplicationException {
    constructor(message = "ForBidden", cause) {
        super(message, 403, cause);
    }
}
exports.ForBiddenException = ForBiddenException;
class ConflictException extends application_exception_1.ApplicationException {
    constructor(message = "Conflict", cause) {
        super(message, 409, cause);
    }
}
exports.ConflictException = ConflictException;
class TooManyRequestException extends application_exception_1.ApplicationException {
    constructor(message = "TooManyRequest", cause) {
        super(message, 429, cause);
    }
}
exports.TooManyRequestException = TooManyRequestException;
