const express = require('express');
const { createProject, updateProject, getAllProjectManagers  } = require('../controllers/projectController');
const router = express.Router();

// Create a new project (admin only)
router.post('/create', createProject);

// Edit an existing project
router.put('/:projectId', updateProject);


module.exports = router;
