import { Schema, model } from 'mongoose';
import type { IProject, IProjectDocument } from '../types/project';

const ComplianceSchema = new Schema<IProjectDocument>({
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
        type: Schema.Types.ObjectId,
        ref: 'ProjectDetail',
        required: true,
    }


}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model('Compliance', ComplianceSchema);
