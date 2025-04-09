// routes/shippingCostRoutes.ts
import express from 'express';
import { calculateShippingCost } from '../controllers/shipping-cost-controller.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Endpoint to calculate shipping cost
router
  .route('/calculate/:storeSlug')
  .get(verifyToken, roleGuard(['CUSTOMERS']), calculateShippingCost);

export default router;
