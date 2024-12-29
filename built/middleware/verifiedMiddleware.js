"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifiedMiddleware = verifiedMiddleware;
const http_status_codes_1 = require("http-status-codes");
function verifiedMiddleware() {
    return (req, res, next) => {
        try {
            console.log(req);
            next();
        }
        catch (error) {
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    };
}
