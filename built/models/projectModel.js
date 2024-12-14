"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["COMPLETED"] = "completed";
    ProjectStatus["SUSPENDED"] = "suspended";
})(ProjectStatus || (ProjectStatus = {}));
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    client_name: {
        type: String,
        required: true,
    },
    compliance_info: {
        type: String,
        required: false,
    },
    created_by: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin', // Reference Admin model
        required: true,
    },
    pm_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin', // Reference Admin model for PMs
        required: true,
    },
    status: {
        type: String,
        enum: ProjectStatus,
        default: ProjectStatus.ACTIVE,
    },
    created_at: {
        type: String,
        default: Date.now().toString,
    },
    updated_at: {
        type: String,
        default: Date.now().toString,
    },
});
exports.default = (0, mongoose_1.model)('Project', ProjectSchema);
