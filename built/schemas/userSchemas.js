"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminVerifySchema = exports.pmRegSchema = exports.adminRegSchema = exports.invitePm = exports.adminLoginSchema = void 0;
const zod_1 = require("zod");
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8)
});
exports.invitePm = zod_1.z.object({
    email: zod_1.z.string().email(),
    admin_id: zod_1.z.string()
});
exports.adminRegSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
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
exports.pmRegSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    fname: zod_1.z.string(),
    lname: zod_1.z.string(),
    admin_id: zod_1.z.string()
});
exports.adminVerifySchema = zod_1.z.object({
    token: zod_1.z.string()
});
