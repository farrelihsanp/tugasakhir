import express from 'express';

import {
  createDiscount,
  getDiscountReport,
  deactivateDiscount,
  activateDiscount,
  getAllDiscounts,
  getDiscountById,
  getDiscountForProduct,
} from '../controllers/discounts-controller.js';

import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// create discount
router.post(
  '/create-discount',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  createDiscount,
);

router.put(
  '/deactivate/:discountId',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  deactivateDiscount,
);

router.put(
  '/activate/:discountId',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  activateDiscount,
);

router.get(
  '/all-discounts',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  getAllDiscounts,
);

router.get('/get-discount/:discountId', getDiscountById);

router.post('/discount-for-product', verifyToken, getDiscountForProduct);

router.get(
  '/report',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  getDiscountReport,
);

export default router;
