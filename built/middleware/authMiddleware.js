"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistToken = void 0;
exports.authMiddleware = authMiddleware;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
// In-memory token blacklist
const tokenBlacklist = new Set();
// Middleware to check for a valid token and blacklist
function authMiddleware(role) {
    return (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                throw new jsonwebtoken_1.JsonWebTokenError('Token not found');
            }
            const token = req.headers.authorization.split(' ')[1];
            if (tokenBlacklist.has(token)) {
                throw new jsonwebtoken_1.JsonWebTokenError('Token has been blacklisted');
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                if (decoded.role !== role) {
                    throw new jsonwebtoken_1.JsonWebTokenError('You are not authorized to access this route');
                }
                else if (decoded.verified === false) {
                    throw new jsonwebtoken_1.JsonWebTokenError('You are not verified');
                }
                else {
                    req.token = decoded;
                    next();
                }
            }
        }
        catch (error) {
            console.log(error);
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({ error: error.message });
        }
    };
}
// Function to add a token to the blacklist (for use in the logout route)
const blacklistToken = (token) => {
    tokenBlacklist.add(token);
};
exports.blacklistToken = blacklistToken;
