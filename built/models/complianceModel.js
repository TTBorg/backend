"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ComplianceSchema = new mongoose_1.Schema({
    document_name: {
        type: String,
        required: true,
    },
    document_url: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    project_detail_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ProjectDetail',
        required: true,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });
exports.default = (0, mongoose_1.model)('Compliance', ComplianceSchema);
