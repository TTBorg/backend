"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteSchema = exports.projectDetailsSchema = exports.reassignProject = exports.createProjectSchema = void 0;
const zod_1 = require("zod");
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z.string(),
    created_by: zod_1.z.string(),
    pm_id: zod_1.z.string()
});
exports.reassignProject = zod_1.z.object({
    pm_id: zod_1.z.string()
});
exports.projectDetailsSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    project_description: zod_1.z.string(),
    project_country: zod_1.z.string(),
    project_state: zod_1.z.string(),
    project_city: zod_1.z.string(),
    project_client: zod_1.z.string(),
});
exports.sendInviteSchema = zod_1.z.object({
    contractors: zod_1.z.array(zod_1.z.object({ email: zod_1.z.string().email(), role: zod_1.z.string() })),
    consultants: zod_1.z.array(zod_1.z.object({ email: zod_1.z.string().email(), role: zod_1.z.string() })),
    owners: zod_1.z.array(zod_1.z.object({ email: zod_1.z.string().email() })),
});
