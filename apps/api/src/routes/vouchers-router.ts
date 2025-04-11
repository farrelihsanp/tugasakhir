// routes/voucherRoutes.ts
import express from 'express';
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherById,
  getAllVouchersUser,
  applyVoucherToCart,
  applyVoucherToShippingCost,
  applyVoucherToProduct,
  // updateVoucherStock,
  claimVoucher,
} from '../controllers/vouchers-controller.js';

import { upload } from '../middlewares/upload-middleware.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Create a new voucher
router.post(
  '/create-voucher',
  verifyToken,
  roleGuard(['STOREADMIN']),
  upload.single('voucherImage'),
  createVoucher,
);

// Update an existing voucher
router.put(
  '/update-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN']),
  upload.single('voucherImage'),
  updateVoucher,
);

// Get all vouchers
router.get(
  '/my-voucher',
  verifyToken,
  roleGuard(['STOREADMIN', 'CUSTOMERS']),
  getAllVouchersUser,
);

// Get a voucher by ID
router.get(
  '/my-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN, CUSTOMERS']),
  getVoucherById,
);

// Delete a voucher
router.delete(
  '/delete-voucher/:id',
  verifyToken,
  roleGuard(['STOREADMIN']),
  deleteVoucher,
);

/* -------------------------------------------------------------------------- */
/*                                APPLY VOUCHER                               */
/* -------------------------------------------------------------------------- */

router.post(
  '/apply-voucher-to-cart',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  applyVoucherToCart,
);

router.post(
  '/apply-voucher-to-shipping-cost',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  applyVoucherToShippingCost,
);

router.post(
  '/apply-voucher-to-product',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  applyVoucherToProduct,
);

// ------------------------------ CLAIM VOUCHER -------------------------------

router.post(
  '/claim-voucher',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  claimVoucher,
);

export default router;
