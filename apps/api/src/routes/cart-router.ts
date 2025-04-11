// routes/cart-router.ts
import express from 'express';
import {
  addToCart,
  increaseQuantityProduct,
  decreaseQuantityProduct,
  deleteCartItem,
  getTotalAmountCart,
  getCart,
  checkout,
} from '../controllers/cart-controller.js';
import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post(
  '/add/:storeSlug',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  addToCart,
);

router.post(
  '/plus',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  increaseQuantityProduct,
);

router.post(
  '/minus',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  decreaseQuantityProduct,
);

router.delete('/remove', verifyToken, roleGuard(['CUSTOMERS']), deleteCartItem);

router.get(
  '/total-amount',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  getTotalAmountCart,
);

router.get('/my-cart', verifyToken, roleGuard(['CUSTOMERS']), getCart);

router.put('/checkout', verifyToken, roleGuard(['CUSTOMERS']), checkout);

export default router;
