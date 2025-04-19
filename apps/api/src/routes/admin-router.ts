import express from 'express';
import {
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAllAdmins,
  getAdminById,
  assignStoreAdmin,
} from '../controllers/admin-controller.js';

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';
import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

// Route for creating an admin
router.post(
  '/create',
  upload.single('adminImage'),
  verifyToken,
  roleGuard(['SUPERADMIN']),
  createAdmin,
);

// Route for updating an admin by ID
router.put(
  '/update/:id',
  upload.single('adminImage'),
  verifyToken,
  roleGuard(['SUPERADMIN']),
  updateAdmin,
);

// Route for getting all admins
router.get(
  '/getAllAdmins/',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  getAllAdmins,
);

// Route for deleting an admin by ID
router.delete(
  '/delete/:id',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  deleteAdmin,
);

// Route for getting an admin by ID
router.get('/:id', verifyToken, roleGuard(['SUPERADMIN']), getAdminById);

router.post(
  '/assign-store-admin',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  assignStoreAdmin,
);

export default router;
