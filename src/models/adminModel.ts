import { Schema, model } from "mongoose";
import type { IUser } from "../types/user";

enum UserRole {
  ADMIN = 'admin',
  PROJECT_MANAGER = 'project_manager'
}

// Define Admin schema
const adminSchema = new Schema<IUser>({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure that emails are unique in the database
  },
  alt_email: {
    type: String
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  country: {
    type: String
  },
  state: {
    type: String
  },
  team_size: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: UserRole,
    default: UserRole.ADMIN
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  verified_mail: {
    type: Boolean,
    default: false
  }
});

export const Admin = model('Admin', adminSchema);

