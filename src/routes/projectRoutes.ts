import { RequestHandler, Router } from 'express';
import { createProject, getProjectsByAdminId, getProjectById } from '../controllers/projectController';
const router = Router();
import { authMiddleware } from '../middleware/authMiddleware';

// router.post('/create', createProject as RequestHandler);
// router.put('/:projectId', updateProject as RequestHandler);
router.get('/admin/:admin_id', getProjectsByAdminId as RequestHandler);
router.get('/:projectId', getProjectById as RequestHandler);
// router.post('/create', createProject);
// router.put('/:projectId', updateProject);
// router.get('/admin/:admin_id', getProjectsByAdminId);
// router.get('/:projectId', getProjectById);

export default router;