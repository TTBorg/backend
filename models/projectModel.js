const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference Admin model
    required: true,
  },
  pm_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin', // Reference Admin model for PMs
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended'],
    default: 'active',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);
