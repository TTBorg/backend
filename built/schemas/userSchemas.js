"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRegSchema = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(8)
});
exports.adminRegSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string().min(8),
    fname: zod_1.z.string(),
    lname: zod_1.z.string(),
    company_name: zod_1.z.string(),
    alt_email: zod_1.z.string(),
    phone: zod_1.z.string(),
    address: zod_1.z.string(),
    country: zod_1.z.string(),
    state: zod_1.z.string(),
    team_size: zod_1.z.number(),
});
