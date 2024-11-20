const express = require('express');
const router = express.Router();
const { signupPM, loginPM } = require('../controllers/pmController');

// Route for PM signup
router.post('/signup', signupPM);
router.post('/login', loginPM);


module.exports = router;
