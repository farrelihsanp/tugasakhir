import { Router } from 'express';
import {
  register,
  completeRegister,
} from '../controllers/register-controller.js';
import { upload } from '../middlewares/upload-middleware.js';

const router = Router();

router.route('/register').post(register);

router
  .route('/fill-data')
  .post(upload.single('profileImage'), completeRegister);

export default router;
