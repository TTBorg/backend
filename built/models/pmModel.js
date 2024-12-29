"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectManager = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["PROJECT_MANAGER"] = "project_manager";
})(UserRole || (UserRole = {}));
const pmSchema = new mongoose_1.Schema({
    fname: { type: String },
    lname: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: UserRole.PROJECT_MANAGER, enum: UserRole },
    assigned_projects: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Project' }],
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    admin_id: { type: String },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.ProjectManager = (0, mongoose_1.model)('ProjectManager', pmSchema);
