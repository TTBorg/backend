import { Schema, model } from 'mongoose';
import type { IProject, IProjectDetails } from '../types/project';





const ProjectDetailsSchema = new Schema<IProjectDetails>({
    project_id: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    owners: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Owner' }],
        required: false,
    },
    contractors: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Contractor' }],
        required: false,
    },
    consultants: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Consultant' }],
        required: false,
    },
    compliance_documents: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Compliance' }],
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

export default model('ProjectDetail', ProjectDetailsSchema);
