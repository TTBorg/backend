const mongoose = require('mongoose');

const pmSchema = new mongoose.Schema({
  fname: { type: String },
  lname: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: 'Project Manager' },
  assigned_projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const ProjectManager = mongoose.model('ProjectManager', pmSchema);

module.exports = ProjectManager;
