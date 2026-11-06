"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandling = void 0;
const globalErrorHandling = (error, req, res, next) => {
    const status = error.status ?? 500;
    return res.status(status).json({
        status,
        error_message: error.message || 'server error',
        error,
        cause: error.cause,
        stack: error.stack
    });
};
exports.globalErrorHandling = globalErrorHandling;
