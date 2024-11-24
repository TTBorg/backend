const express = require('express');
const router = express.Router();
const { signupPM, loginPM, getAllProjectManagers } = require('../controllers/pmController');

// Route for PM signup
router.post('/signup', signupPM);
router.post('/login', loginPM);
router.get('/project-managers', getAllProjectManagers);


module.exports = router;
