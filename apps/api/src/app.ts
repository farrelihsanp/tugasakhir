import './configs/env.js';

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import confirmEmailRouter from './routes/confirm-email-router.js';
import registerRouter from './routes/register-router.js';
import logRouter from './routes/log-router.js';
import storeRouter from './routes/store-router.js';
import adminRouter from './routes/admin-router.js';
import confirmResetPasswordRouter from './routes/confirm-reset-password.js';
import addressRouter from './routes/address-router.js';
import cartRouter from './routes/cart-router.js';
import userRouter from './routes/user-router.js';
import confirmUpdateEmailRouter from './routes/confirm-update-email-router.js';
import shippingCostRouter from './routes/shipping-cost-router.js';
import productRouter from './routes/products-router.js';
import vouchersRouter from './routes/vouchers-router.js';
import categoriesRouter from './routes/categories-router.js';
import orderRouter from './routes/orders-router.js';
import discountRouter from './routes/discounts-router.js';
import reportRouter from './routes/reports-stock-router.js';

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: process.env.WEB_DOMAIN, credentials: true }));

app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running well' });
});

app.use('/api/v1/auth', registerRouter);
app.use('/api/v1/auth', logRouter);
// confirm
app.use('/api/v1/confirm', confirmEmailRouter);
app.use('/api/v1/confirm', confirmUpdateEmailRouter);
app.use('/api/v1/confirm', confirmResetPasswordRouter);
// ---
app.use('/api/v1/stores', storeRouter);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/addresses', addressRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1', userRouter);
app.use('/api/v1/shipping-cost', shippingCostRouter);
app.use('/api/v1', productRouter);
app.use('/api/v1', vouchersRouter);
app.use('/api/v1', categoriesRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1', discountRouter);
app.use('/api/v1/report-stock', reportRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});

export default app;
