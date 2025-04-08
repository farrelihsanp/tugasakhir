import express from 'express';
import {
  createProduct,
  deleteProduct,
  updateProductGlobal,
  updateProductInSomeStore,
  getDetailProductByIdByStoreId,
  getAllProductsByStoreId,
  getAllProductsByCategoryByStoreId,
  getCheapProductsByStoreId,
  getFilteredProductChanges,
  getMonthlyProductSummary,
} from '../controllers/products-controller.js';

import { uploadMany } from '../middlewares/upload-many-middleware.js';
import { verifyToken, roleGuard } from '../middlewares/auth-middleware.js';

const router = express.Router();

// Create a new product
router
  .route('/create-product')
  .post(
    uploadMany.array('productImages', 5),
    verifyToken,
    roleGuard(['SUPERADMIN']),
    createProduct,
  );

// Delete a product
router
  .route('/delete-product')
  .delete(verifyToken, roleGuard(['SUPERADMIN']), deleteProduct);

router
  .route('/update-product')
  .put(verifyToken, roleGuard(['SUPERADMIN']), updateProductGlobal);

router
  .route('/update-product-in-store/:id')
  .put(verifyToken, roleGuard(['SUPERADMIN']), updateProductInSomeStore);

// Get a product by ID
router
  .route('/detail-product/:storeSlug/:productSlug')
  .get(verifyToken, getDetailProductByIdByStoreId);

// Get all products by store
router.route('/products-store/:storeId').get(getAllProductsByStoreId);

// get all products by category
router
  .route('/productsBycategories/:storeSlug/:categorySlug')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getAllProductsByCategoryByStoreId,
  );

// get all cheap products
router.route('/cheap-products-store/:storeId').get(getCheapProductsByStoreId);

router.get('/product-change-data', getFilteredProductChanges);

router.get('/monthly-product-summary', getMonthlyProductSummary);

export default router;
