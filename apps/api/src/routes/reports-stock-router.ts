import express from 'express';

import { getStockReportStore } from '../controllers/reports-stock-controller.js';

import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.get(
  '/store/:storeSlug',
  verifyToken,
  roleGuard(['SUPERADMIN', 'STOREADMIN']),
  getStockReportStore,
);

export default router;
