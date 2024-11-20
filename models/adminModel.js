const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Admin schema
const adminSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
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
    default: 'Admin'
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
