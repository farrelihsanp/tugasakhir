import express from 'express';
import {
  payWithBankTransfer,
  payWithMidTrans,
  uploadPaymentProof,
  getAllOrdersStatusPending,
  cancelOrder,
  orderConfirmed,
  getAllOrderCustomer,
  seePaymentProof,
  acceptPaymentProof,
  rejectPaymentProof,
  processOrder,
  sentOrder,
  getAllOrderHistory,
  getOrderDetail,
} from '../controllers/orders-controller.js';

import { upload } from '../middlewares/upload-middleware.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Create a new order with bank transfer
router
  .route('/create-order-bank-transfer/:storeSlug')
  .post(verifyToken, roleGuard(['CUSTOMERS']), payWithBankTransfer);

// Create a new order with Midtrans
router
  .route('/create-order-midtrans/:storeSlug')
  .post(verifyToken, roleGuard(['CUSTOMERS']), payWithMidTrans);

// Upload payment proof for bank transfer
router
  .route('/upload-payment-proof/:orderSlug')
  .post(
    upload.single('orderImage'),
    verifyToken,
    roleGuard(['CUSTOMERS']),
    uploadPaymentProof,
  );

// Cancel an order
router
  .route('/cancel-order')
  .post(verifyToken, roleGuard(['CUSTOMERS']), cancelOrder);

// order confirmed
router.route('/order-confirmed').post(orderConfirmed);

router.route('/order-customer').get(verifyToken, getAllOrderCustomer);

// ---------------- ADMIN --------------
// Get all orders with pending payment
router.route('/orders').get(verifyToken, getAllOrdersStatusPending);

// See payment proof for an order
router
  .route('/see-payment-proof/:orderSlug')
  .get(verifyToken, roleGuard(['STOREADMINS']), seePaymentProof);

// Accept payment proof for an order
router
  .route('/accept-payment-proof/:orderSlug')
  .post(verifyToken, roleGuard(['STOREADMINS']), acceptPaymentProof);

// Reject payment proof for an order
router
  .route('/reject-payment-proof/:orderSlug')
  .post(verifyToken, roleGuard(['STOREADMINS']), rejectPaymentProof);

// Process an order
router
  .route('/process-order/:orderSlug')
  .post(verifyToken, roleGuard(['STOREADMINS']), processOrder);

// Mark an order as shipped
router
  .route('/sent-order/:orderSlug')
  .post(verifyToken, roleGuard(['STOREADMINS']), sentOrder);

// get all orders customers
router.route('/order-history').get(verifyToken, getAllOrderHistory);

/* -------------------------------------------------------------------------- */
/*                           FOR CUSTOMER AND ADMIN                           */
/* -------------------------------------------------------------------------- */
router.route('/order-history/:orderSlug').get(verifyToken, getOrderDetail);

export default router;
