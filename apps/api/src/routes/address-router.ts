// routes/addressRoutes.ts
import express from 'express';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAllAddresses,
  setPrimaryAddress,
  getPrimaryAddress,
  getAddressById,
} from '../controllers/address-controller.js';

import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Menambahkan alamat baru
router.route('/').post(verifyToken, roleGuard(['CUSTOMERS']), addAddress);

// Memperbarui alamat
router.route('/:id').put(verifyToken, roleGuard(['CUSTOMERS']), updateAddress);

// Menghapus alamat
router
  .route('/:id')
  .delete(verifyToken, roleGuard(['CUSTOMERS']), deleteAddress);

// Mengambil semua alamat pengguna
router
  .route('/user/:userId')
  .get(verifyToken, roleGuard(['CUSTOMERS']), getAllAddresses);

// Menetapkan alamat utama
router
  .route('/set-primary')
  .post(verifyToken, roleGuard(['CUSTOMERS']), setPrimaryAddress);

router
  .route('/get-primary')
  .get(verifyToken, roleGuard(['CUSTOMERS']), getPrimaryAddress);

router.route('/:id').get(verifyToken, roleGuard(['CUSTOMERS']), getAddressById);

export default router;
