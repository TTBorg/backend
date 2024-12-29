"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const pmController_1 = require("../controllers/pmController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const userSchemas_1 = require("../schemas/userSchemas");
const projectSchema_1 = require("../schemas/projectSchema");
// Route for PM signup
/**
 * @swagger
 * /api/pm/signup:
 *   post:
 *     summary: Project Manager
 *     description: Project Manager Signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lname
 *               - fname
 *               - password
 *               - email
 *               - admin_id
 *             properties:
 *               email:
 *                 type: string
 *                 description: email
 *               password:
 *                 type: string
 *                 description: password
 *               lname:
 *                 type: string
 *                 description: last name
 *               fname:
 *                 type: string
 *                 description: first name
 *               admin_id:
 *                 type: string
 *                 description: Admin ID
 *     responses:
 *       200:
 *         description: Project Manager created
 *       400:
 *         description: Bad Request
 */
router.post('/signup', (0, validationMiddleware_1.validateData)(userSchemas_1.pmRegSchema), pmController_1.signupPM);
/**
 * @swagger
 * /api/pm/login:
 *   post:
 *     summary: Project Manager
 *     description: Project Manager Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: email
 *               password:
 *                 type: string
 *                 description: password
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/login', (0, validationMiddleware_1.validateData)(userSchemas_1.adminLoginSchema), pmController_1.loginPM);
/**
 * @swagger
 * /api/pm/project/details:
 *   post:
 *     summary: Project Manager project details
 *     description: Project Details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - project_id
 *               - project_description
 *               - project_country
 *               - project_state
 *               - project_city
 *               - project_client
 *             properties:
 *               project_id:
 *                 type: string
 *                 description: project_id
 *               project_description:
 *                 type: string
 *                 description: project_description
 *               project_country:
 *                 type: string
 *                 description: project_country
 *               project_state:
 *                 type: string
 *                 description: project_state
 *               project_city:
 *                 type: string
 *                 description: project_city
 *               project_client:
 *                 type: string
 *                 description: project_client
 *               compliance_documents:
 *                 type: array
 *     responses:
 *       201:
 *         description: Project Details created
 *       400:
 *         description: Bad Request
 */
router.post('/project/details', (0, authMiddleware_1.authMiddleware)('project_manager'), pmController_1.createProjectDetails);
/**
 * @swagger
 * /api/pm/project/sendInvites:
 *   post:
 *     summary: Project Manager
 *     description: Send Invites
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - contractors
 *               - consultants
 *               - owners
 *             properties:
 *               contractors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: email
 *                     role:
 *                       type: string
 *                       description: role
 *               consultants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: email
 *                     role:
 *                       type: string
 *                       description: role
 *               owners:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: email
 *     responses:
 *       200:
 *         description: Invites sent
 *       400:
 *         description: Bad Request
 */
router.post('/project/sendInvites', [(0, authMiddleware_1.authMiddleware)('project_manager'), (0, validationMiddleware_1.validateData)(projectSchema_1.sendInviteSchema)], pmController_1.sendInvites);
router.get('/project-managers/admin/:adminId', pmController_1.getProjectManagersByAdmin);
exports.default = router;
