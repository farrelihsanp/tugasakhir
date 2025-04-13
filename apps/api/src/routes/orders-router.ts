import express from 'express';
import {
  createOrder,
  payWithManualTransfer,
  // payWithMidTrans,
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

router
  .route('/create-order/:storeSlug')
  .post(verifyToken, roleGuard(['CUSTOMERS']), createOrder);

router
  .route('/manual-transfer/:orderId')
  .put(verifyToken, roleGuard(['CUSTOMERS']), payWithManualTransfer);

// Create a new order with Midtrans
// router
//   .route('/create-order-midtrans/:storeSlug')
//   .post(verifyToken, roleGuard(['CUSTOMERS']), payWithMidTrans);

// Upload payment proof for bank transfer

router
  .route('/upload-payment-proof/:orderId')
  .post(
    upload.single('paymentProof'),
    verifyToken,
    roleGuard(['CUSTOMERS']),
    uploadPaymentProof,
  );

// Cancel an order
router
  .route('/cancel-order')
  .put(verifyToken, roleGuard(['CUSTOMERS']), cancelOrder);

// order confirmed
router
  .route('/order-confirmed')
  .put(verifyToken, roleGuard(['CUSTOMERS']), orderConfirmed);

// get all orders customer

router.route('/order-customer').get(verifyToken, getAllOrderCustomer);

// ---------------- ADMIN --------------
// Get all orders with pending payment
router.route('/orders').get(verifyToken, getAllOrdersStatusPending);

// See payment proof for an order
router
  .route('/see-payment-proof/:orderId')
  .get(verifyToken, roleGuard(['STOREADMIN']), seePaymentProof);

// Accept payment proof for an order
router
  .route('/accept-payment-proof/:orderId')
  .put(verifyToken, roleGuard(['STOREADMIN']), acceptPaymentProof);

// Reject payment proof for an order
router
  .route('/reject-payment-proof/:orderId')
  .put(verifyToken, roleGuard(['STOREADMIN']), rejectPaymentProof);

// Process an order
router
  .route('/process-order/:orderId')
  .put(verifyToken, roleGuard(['STOREADMIN']), processOrder);

router
  .route('/sent-order/:orderId')
  .put(verifyToken, roleGuard(['STOREADMIN']), sentOrder);

// get all orders customers
router.route('/order-history').get(verifyToken, getAllOrderHistory);

/* -------------------------------------------------------------------------- */
/*                           FOR CUSTOMER AND ADMIN                           */
/* -------------------------------------------------------------------------- */
router.route('/order-detail/:orderSlug').get(verifyToken, getOrderDetail);

export default router;
