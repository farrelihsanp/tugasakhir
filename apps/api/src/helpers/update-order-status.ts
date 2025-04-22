// import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { prisma } from '../configs/prisma.js';
import { OrderStatusData } from '../types/express.d.js';
import { OrderStatus } from '@prisma/client';

export async function updateOrderStatus(data: OrderStatusData) {
  const hash = crypto
    .createHash('sha512')
    .update(
      `${data.order_id}${data.status_code}${data.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
    )
    .digest('hex');

  if (data.signature_key !== hash) {
    return { status: 'error', message: 'Invalid signature key' };
  }

  const transactionStatus = data.transaction_status;
  const fraudStatus = data.fraudStatus;

  if (transactionStatus === 'capture') {
    if (fraudStatus === 'accept') {
      await prisma.order.update({
        where: { id: +data.order_id },
        data: { status: 'PAID' },
      });
    }
  } else if (transactionStatus === 'settlement') {
    await prisma.order.update({
      where: { id: +data.order_id },
      data: { status: OrderStatus.PAID },
    });
  } else if (
    transactionStatus === 'cancel' ||
    transactionStatus === 'deny' ||
    transactionStatus === 'expire' ||
    transactionStatus === 'failure'
  ) {
    await prisma.order.update({
      where: { id: +data.order_id },
      data: { status: OrderStatus.PAYMENT_DECLINED },
    });
  } else if (transactionStatus === 'pending') {
    await prisma.order.update({
      where: { id: +data.order_id },
      data: { status: OrderStatus.PENDING_PAYMENT },
    });
  }
}
