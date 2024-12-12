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
  client_name: {
    type: String,
    required: true,
  },
  compliance_info: {
    type: String,
    required: false,
  },
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'Admin', // Reference Admin model
    required: true,
  },
  pm_id: {
    type: Schema.Types.ObjectId,
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

export default model('Project', ProjectSchema);
