const express = require('express');
const router = express.Router();
const { signupPM, loginPM, getAllProjectManagers, getProjectManagersByAdmin } = require('../controllers/pmController');

// Route for PM signup
router.post('/signup', signupPM);
router.post('/login', loginPM);
router.get('/project-managers', getAllProjectManagers);
router.get('/project-managers/admin/:adminId', getProjectManagersByAdmin);


module.exports = router;
