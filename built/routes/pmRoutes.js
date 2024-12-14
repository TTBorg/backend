"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const pmController_1 = require("../controllers/pmController");
// Route for PM signup
router.post('/signup', pmController_1.signupPM);
router.post('/login', pmController_1.loginPM);
router.get('/project-managers', pmController_1.getAllProjectManagers);
router.get('/project-managers/admin/:adminId', pmController_1.getProjectManagersByAdmin);
exports.default = router;
