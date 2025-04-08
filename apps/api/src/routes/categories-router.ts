import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  getCategoryById,
  deleteCategory,
} from '../controllers/category-controller.js';

import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

router.post('/categories', upload.single('image'), createCategory);

router.route('/all-categories').get(getAllCategories);

router.route('/category/:id').get(getCategoryById);

router
  .route('/update-category/:id')
  .put(upload.single('image'), updateCategory);

router.route('/delete-category/:id').delete(deleteCategory);

export default router;
