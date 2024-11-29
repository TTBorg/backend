const express = require('express');
const { createProject, updateProject, getProjectsByAdminId, getProjectById  } = require('../controllers/projectController');
const router = express.Router();

// Create a new project (admin only)
router.post('/create', createProject);
router.put('/:projectId', updateProject);
router.get('/admin/:admin_id', getProjectsByAdminId);
router.get('/:projectId', getProjectById);

module.exports = router;