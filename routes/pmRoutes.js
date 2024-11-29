const express = require('express');
const router = express.Router();
const { signupPM, loginPM, getAllProjectManagers, getProjectManagersByAdmin } = require('../controllers/pmController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Route for PM signup
router.post('/signup', signupPM);
router.post('/login', loginPM);
router.get('/project-managers', authMiddleware, getAllProjectManagers);
router.get('/project-managers/admin/:adminId', authMiddleware, getProjectManagersByAdmin);


module.exports = router;
