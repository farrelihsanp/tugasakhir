import express from 'express';

import {
  createDiscount,
  getDiscountReport,
  deactivateDiscount,
  activateDiscount,
  getAllDiscounts,
  getDiscountById,
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

router.get(
  '/report',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  getDiscountReport,
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

router.get(
  '/discount/:discountId',
  verifyToken,
  roleGuard(['SUPERADMIN']),
  getDiscountById,
);

export default router;
