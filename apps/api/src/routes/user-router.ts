import express from 'express';
import {
  getAllCustomers,
  getAllUsers,
  getUserById,
  deleteUser,
  lookupUser,
  createUser,
} from '../controllers/user-controller.js';

const router = express.Router();

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

router
  .route('/users')
  .get(verifyToken, roleGuard(['SUPERADMIN']), getAllCustomers);

router
  .route('/all-users')
  .get(verifyToken, roleGuard(['SUPERADMIN', 'STOREADMIN']), getAllUsers);

router
  .route('/customers')
  .get(verifyToken, roleGuard(['SUPERADMIN']), getAllCustomers);

router
  .route('/users/:id')
  .get(verifyToken, roleGuard(['SUPERADMIN']), getUserById)
  .delete(verifyToken, roleGuard(['SUPERADMIN']), deleteUser);

router.route('/lookup-user').post(lookupUser);

router.route('/create-user').post(roleGuard(['CUSTOMERS']), createUser);

export default router;
