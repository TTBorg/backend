import { RequestHandler, Router } from 'express'
import { registerAdmin, invitePM, loginAdmin, logoutAdmin, getAllAdmins, verifyEmail, createProject, reassignProjectController, getAllProjectManagers, getAllProjects } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateData } from '../middleware/validationMiddleware';
import { adminLoginSchema, adminRegSchema, adminVerifySchema, invitePm } from '../schemas/userSchemas';
import { createProjectSchema, reassignProject } from '../schemas/projectSchema';


const router = Router();

/**
 * @swagger
 * /api/admin/signup:
 *   post:
 *     summary: Admin
 *     description: Admin Signup
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
 *               - phone
 *               - country
 *               - address
 *               - state
 *               - team_size
 *               - alt_email
 *               - company_name 
 * 
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
 *               phone:
 *                 type: string
 *                 description: phone
 *               country:
 *                 type: string
 *                 description: country
 *               address:
 *                 type: string
 *                 description: address
 *               state:
 *                 type: string
 *                 description: state
 *               team_size:
 *                 type: string
 *                 description: team size
 *               alt_email:
 *                 type: string
 *                 description: alt email
 *               company_name:
 *                 type: string
 *                 description: company name
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/signup', validateData(adminRegSchema), registerAdmin);

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin
 *     description: Admin Login
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
router.post('/login', validateData(adminLoginSchema), loginAdmin);

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin
 *     description: Admin Logout
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:        
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/logout', logoutAdmin);

/**
 * @swagger
 * /api/admin/verify-email:
 *   post:
 *     summary: Admin
 *     description: Admin Verify Email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: token
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/verify-email', validateData(adminVerifySchema), verifyEmail);

// router.use(checkRoleMiddleware('admin'));


/**
 * @swagger
 * /api/admin/invite-pm:
 *   post:
 *     summary: Admin
 *     description: Admin Invite PM
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: email of pm to invite
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/invite-pm', [authMiddleware('admin'), validateData(invitePm)], invitePM);

/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     summary: Admin 
 *     description: Get all Admins 
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/admins', [authMiddleware('admin')], getAllAdmins);


/**
 * @swagger
 * /api/admin/project/create:
 *   post:
 *     summary: Create Project
 *     description: Create Project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - created_by
 *               - pm_id 
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the project
 *               created_by:
 *                 type: string
 *                 description: Id of Admin
 *               pm_id:
 *                 type: string
 *                 description: Id of PM
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor. 
 */
router.post('/project/create', [authMiddleware('admin'), validateData(createProjectSchema)], createProject as RequestHandler);


/**
 * @swagger
 * /api/admin/project-managers:
 *   get:
 *     summary: get all project managers 
 *     description: Get all pms 
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/project-managers', getAllProjectManagers as RequestHandler);


/**
 * @swagger
 * /api/admin/projects:
 *   get:
 *     summary: get all projects 
 *     description: Get all projects 
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente.
 *       400:
 *         description: La solicitud es incorrecta o incompleta.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/projects', getAllProjects as RequestHandler);



router.post('/project/:id/reassign', [authMiddleware('admin'), validateData(reassignProject)], reassignProjectController as RequestHandler);

export default router;
