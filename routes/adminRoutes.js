const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, logoutAdmin } = require('../controllers/adminController');  
const { authMiddleware } = require('../middleware/authMiddleware'); 
const { invitePM } = require('../controllers/adminController');

router.post('/signup', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', authMiddleware, logoutAdmin); 
router.post('/invite-pm', invitePM);

// router.post('/logout', authMiddleware, logoutAdmin);

module.exports = router;
