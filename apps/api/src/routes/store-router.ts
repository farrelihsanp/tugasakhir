// routes/storeRoutes.ts
import express from 'express';
import {
  createStore,
  updateStore,
  deleteStore,
  getStoreById,
  getStoreBySlug,
  getAllStores,
  getNearestStore,
} from '../controllers/store-controller.js';

import { upload } from '../middlewares/upload-middleware.js';
import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Middleware for protected routes
const protectedRoute = [verifyToken, roleGuard(['SUPERADMIN'])];

// Create a new store
router.post('/', upload.single('storeImage'), ...protectedRoute, createStore);

// Update an existing store
router.put('/:id', upload.single('storeImage'), ...protectedRoute, updateStore);

// Delete a store
router.delete('/:id', ...protectedRoute, deleteStore);

// Get a store by ID
router.get('/someStore/:id', getStoreById);

// Get a store by slug
router.get('/store-slug/:storeSlug', getStoreBySlug);

// Get all stores
router.get('/', getAllStores);

// Get Nearest Store
router.get('/nearest-store', getNearestStore);

export default router;
