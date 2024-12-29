"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProjectDetailsSchema = new mongoose_1.Schema({
    project_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
    },
    owners: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Owner' }],
        required: false,
    },
    contractors: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Contractor' }],
        required: false,
    },
    consultants: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Consultant' }],
        required: false,
    },
    compliance_documents: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Compliance' }],
        required: false,
    },
    compliance_info: {
        type: String,
        required: false,
    },
    project_description: {
        type: String,
        required: true,
    },
    project_country: {
        type: String,
        required: true,
    },
    project_state: {
        type: String,
        required: true,
    },
    project_city: {
        type: String,
        required: true,
    },
    project_client: {
        type: String,
        required: true,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.default = (0, mongoose_1.model)('ProjectDetail', ProjectDetailsSchema);
