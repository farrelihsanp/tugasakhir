// routes/cart-router.ts
import express from 'express';
import {
  addToCart,
  increaseQuantityProduct,
  decreaseQuantityProduct,
  deleteCartItem,
  getCart,
} from '../controllers/cart-controller.js';
import { verifyToken } from '../middlewares/auth-middleware.js';
import { roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/add/:storeId', verifyToken, roleGuard(['CUSTOMERS']), addToCart);

router.post(
  '/plus-one/:storeId',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  increaseQuantityProduct,
);

router.post(
  '/minus-one/:storeId',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  decreaseQuantityProduct,
);

router.delete(
  '/remove/:productId',
  verifyToken,
  roleGuard(['CUSTOMERS']),
  deleteCartItem,
);

router.get('/my-cart', verifyToken, roleGuard(['CUSTOMERS']), getCart);

export default router;
