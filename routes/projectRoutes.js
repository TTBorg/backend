const express = require('express');
const { createProject, updateProject, getProjectsByAdminId  } = require('../controllers/projectController');
const router = express.Router();

// Create a new project (admin only)
router.post('/create', createProject);
router.put('/:projectId', updateProject);
router.get('/admin/:admin_id', getProjectsByAdminId);

module.exports = router;
