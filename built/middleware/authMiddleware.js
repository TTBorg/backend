"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistToken = void 0;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// In-memory token blacklist
const tokenBlacklist = new Set();
// Middleware to check for a valid token and blacklist
function authMiddleware() {
    return (req, res, next) => {
        var _a;
        const token = (_a = req.header('Aut/workspaces/backend/src/confighorization')) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token)
            return res.status(401).json({ error: 'Access denied, no token provided' });
        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            return res.status(403).json({ error: 'Token has been invalidated. Please log in again.' });
        }
        try {
            const secret = process.env.JWT_SECRET || '';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // req.user = decoded;
            return next();
        }
        catch (error) {
            res.status(400).json({ error: 'Invalid token' });
        }
    };
}
// Function to add a token to the blacklist (for use in the logout route)
const blacklistToken = (token) => {
    tokenBlacklist.add(token);
};
exports.blacklistToken = blacklistToken;
