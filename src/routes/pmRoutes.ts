import { RequestHandler, Router } from 'express';
const router = Router();
import { signupPM, loginPM, getAllProjectManagers, getProjectManagersByAdmin } from '../controllers/pmController';
import { authMiddleware } from '../middleware/authMiddleware';

// Route for PM signup
router.post('/signup', signupPM as RequestHandler);
router.post('/login', loginPM as RequestHandler);
router.get('/project-managers', getAllProjectManagers as RequestHandler);
router.get('/project-managers/admin/:adminId', getProjectManagersByAdmin as RequestHandler);


export default router
