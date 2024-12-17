import { RequestHandler, Router } from 'express'
import { registerAdmin, loginAdmin, logoutAdmin, getAllAdmins, verifyEmail } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { invitePM } from '../controllers/adminController';
import { validateData } from '../middleware/validationMiddleware';
import { adminLoginSchema, adminRegSchema, adminVerifySchema, invitePm } from '../schemas/userSchemas';


const router = Router();
router.post('/signup', validateData(adminRegSchema), registerAdmin as RequestHandler);
router.post('/login', validateData(adminLoginSchema), loginAdmin as RequestHandler);
router.post('/logout', logoutAdmin as RequestHandler);
router.post('/verify-email', validateData(adminVerifySchema), verifyEmail as RequestHandler);

router.post('/invite-pm', [authMiddleware, validateData(invitePm)], invitePM as RequestHandler);
router.get('/admins', getAllAdmins as RequestHandler);


// router.post('/logout', authMiddleware, logoutAdmin);

export default router;
