import express from 'express';
import {
  createOrder,
  payWithManualTransfer,
  payWithMidTrans,
  orderNotification,
  uploadPaymentProof,
  getAllOrdersStore,
  cancelOrder,
  orderConfirmed,
  getAllOrderCustomer,
  getOrderCustomer,
  seePaymentProof,
  acceptPaymentProof,
  rejectPaymentProof,
  processOrder,
  sentOrder,
  getAllOrderHistory,
  getOrderById,
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

router
  .route('/create-order-midtrans/:orderId')
  .put(verifyToken, roleGuard(['CUSTOMERS']), payWithMidTrans);

router.route('/notification').post(orderNotification);

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
  .route('/cancel-order/:orderId')
  .delete(verifyToken, roleGuard(['CUSTOMERS']), cancelOrder);

// order confirmed
router
  .route('/order-confirmed/:orderId')
  .put(verifyToken, roleGuard(['CUSTOMERS']), orderConfirmed);

// get all orders customer
router.route('/orders-customers').get(verifyToken, getAllOrderCustomer);

// get order customer
router.route('/orders-customer').get(verifyToken, getOrderCustomer);

// ---------------- ADMIN --------------
// Get all orders with pending payment
router.route('/orders-store/:storeId').get(verifyToken, getAllOrdersStore);

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
router.route('/order-detail/:orderId').get(verifyToken, getOrderById);

export default router;
