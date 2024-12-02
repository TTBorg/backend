const express = require('express');
const { createProject, updateProject, getProjectsByAdminId, getProjectById  } = require('../controllers/projectController');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createProject);
router.put('/:projectId', authMiddleware, updateProject);
router.get('/admin/:admin_id', authMiddleware, getProjectsByAdminId);
router.get('/:projectId', authMiddleware, getProjectById);
// router.post('/create', createProject);
// router.put('/:projectId', updateProject);
// router.get('/admin/:admin_id', getProjectsByAdminId);
// router.get('/:projectId', getProjectById);

module.exports = router;