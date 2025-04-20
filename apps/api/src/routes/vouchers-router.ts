// routes/voucherRoutes.ts
import express from 'express';
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  getVoucherById,
  getAllVouchersUser,
  getAllVouchersAdmin,
  applyVoucherToCart,
  applyVoucherToShippingCost,
  applyVoucherToProduct,
  // updateVoucherStock,
  claimVoucher,
  getVoucherByCode,
  removeVoucher,
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
  '/update-voucher/:voucherCode',
  verifyToken,
  roleGuard(['STOREADMIN']),
  upload.single('voucherImage'),
  updateVoucher,
);

router.get(
  '/my-voucher',
  verifyToken,
  roleGuard(['STOREADMIN', 'CUSTOMERS']),
  getAllVouchersUser,
);

router.get('/all-vouchers', getAllVouchersAdmin);

// Get a voucher by ID
router.get(
  '/my-voucher/:id',
  verifyToken,
  roleGuard(['CUSTOMERS', 'STOREADMIN']),
  getVoucherById,
);

// Delete a voucher
router.delete(
  '/delete-voucher',
  verifyToken,
  roleGuard(['STOREADMIN']),
  deleteVoucher,
);

router.post(
  '/claim-voucher',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  claimVoucher,
);

router.get(
  '/get-voucher-by-code/:voucherCode',
  verifyToken,
  roleGuard(['STOREADMIN', 'CUSTOMERS']),
  getVoucherByCode,
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

router.post(
  '/remove-voucher',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  removeVoucher,
);

// ------------------------------ CLAIM VOUCHER -------------------------------

export default router;
