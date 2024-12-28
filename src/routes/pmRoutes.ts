import { RequestHandler, Router } from 'express';
const router = Router();
import { signupPM, loginPM, getProjectManagersByAdmin, createProjectDetails, sendInvites } from '../controllers/pmController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateData } from '../middleware/validationMiddleware';
import { adminLoginSchema, pmRegSchema } from '../schemas/userSchemas';
import { sendInviteSchema } from '../schemas/projectSchema';

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
router.post('/signup', validateData(pmRegSchema), signupPM as RequestHandler);


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
router.post('/login', validateData(adminLoginSchema), loginPM as RequestHandler);


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
router.post('/project/details', authMiddleware('project_manager'), createProjectDetails as RequestHandler);


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
router.post('/project/sendInvites', [authMiddleware('project_manager'), validateData(sendInviteSchema)], sendInvites as RequestHandler);


router.get('/project-managers/admin/:adminId', getProjectManagersByAdmin as RequestHandler);


export default router
