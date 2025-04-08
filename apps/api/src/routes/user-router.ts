import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/user-controller.js';

const router = express.Router();

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

router.route('/users').get(verifyToken, roleGuard(['SUPERADMIN']), getAllUsers);

router
  .route('/users/:id')
  .get(verifyToken, roleGuard(['SUPERADMIN']), getUserById)
  .delete(verifyToken, roleGuard(['SUPERADMIN']), deleteUser);

export default router;
