import express from 'express';
import {
  createProduct,
  updateProductGlobal,
  updateProductInSomeStore,
  deleteProduct,
  getAllProducts,
  getDetailProductBySlugByStoreSlug,
  getAllProductsByStoreId,
  getAllProductsByStoreSlug,
  getAllProductsByCategoryByStoreSlug,
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

router
  .route('/update-product-global')
  .put(
    uploadMany.array('productImages', 5),
    verifyToken,
    roleGuard(['SUPERADMIN']),
    updateProductGlobal,
  );

router
  .route('/update-product-in-store/:storeSlug')
  .put(verifyToken, roleGuard(['SUPERADMIN']), updateProductInSomeStore);

// Delete a product
router
  .route('/delete-product')
  .delete(verifyToken, roleGuard(['SUPERADMIN']), deleteProduct);

router
  .route('/all-products')
  .get(verifyToken, roleGuard(['SUPERADMIN', 'STOREADMIN']), getAllProducts);

// Get a product by ID
router
  .route('/detail-product/:storeSlug/:productSlug')
  .get(verifyToken, getDetailProductBySlugByStoreSlug);

// Get all products by store
router.route('/products-store/:storeId').get(getAllProductsByStoreId);

router
  .route('/products-store-slug/:storeSlug')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getAllProductsByStoreSlug,
  );

// get all products by category
router
  .route('/productsBycategories/:storeSlug/:categorySlug')
  .get(
    verifyToken,
    roleGuard(['CUSTOMERS', 'SUPERADMIN', 'STOREADMIN']),
    getAllProductsByCategoryByStoreSlug,
  );

// get all cheap products
router.route('/cheap-products-store/:storeId').get(getCheapProductsByStoreId);

router.get('/product-change-data', getFilteredProductChanges);

router.get('/monthly-product-summary', getMonthlyProductSummary);

export default router;
