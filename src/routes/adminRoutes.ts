import { RequestHandler, Router } from 'express'
import { registerAdmin, loginAdmin, logoutAdmin, getAllAdmins } from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { invitePM } from '../controllers/adminController';


const router = Router();
router.post('/signup', registerAdmin as RequestHandler);
router.post('/login', loginAdmin as RequestHandler);
router.post('/logout',  logoutAdmin as RequestHandler);
router.post('/invite-pm', invitePM as RequestHandler);
router.get('/admins', getAllAdmins as RequestHandler);


// router.post('/logout', authMiddleware, logoutAdmin);

export default router;
