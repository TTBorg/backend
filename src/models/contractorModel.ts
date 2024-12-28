import { Schema, model } from "mongoose";
import { UserRole, type IUser } from "../types/user";



// Define Admin schema
const contractorSchema = new Schema<IUser>({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  specialization: {
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
    default: UserRole.CONTRACTOR
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

export const Contractor = model('Contractor', contractorSchema);

