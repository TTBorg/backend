import { Schema, model } from 'mongoose';
import type { IProject } from '../types/project';

enum ProjectStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended',
}



const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: true,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', // Reference Admin model
    required: true,
  },
  pm_id: {
    type: Schema.Types.ObjectId,
    ref: 'ProjectManager', // Reference PM model for PMs
    required: true,
  },
  status: {
    type: String,
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default model('Project', ProjectSchema);
