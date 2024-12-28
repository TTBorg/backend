import { Schema, model } from "mongoose";
import type { IUser } from "../types/user";

enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager'
}
const pmSchema = new Schema<IUser>({
  fname: { type: String },
  lname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: UserRole.PROJECT_MANAGER, enum: UserRole },
  assigned_projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  admin_id: { type: String },  
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at' }});

export const ProjectManager = model('ProjectManager', pmSchema);


