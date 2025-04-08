import express from 'express';
import {
  getCurrentUser,
  login,
  logout,
  submitNewPassword,
  sendEmailresetPassword,
  updateUserProfile,
} from '../controllers/log-controller.js';

import { verifyToken } from '../middlewares/auth-middleware.js';
import { upload } from '../middlewares/upload-middleware.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/me').get(verifyToken, getCurrentUser);
router.route('/reset-password').post(sendEmailresetPassword);
router.route('/submit-new-password').post(submitNewPassword);
router
  .route('/update-profile/:userId')
  .put(verifyToken, upload.single('profileImage'), updateUserProfile);

export default router;
