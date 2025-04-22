import cron from 'node-cron';
import { prisma } from '../configs/prisma.js';
import { OrderStatus } from '@prisma/client';

const autoCompletedOrder = async () => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    await prisma.order.updateMany({
      where: {
        status: OrderStatus.DELIVERED,
        deliveredAt: {
          lte: sevenDaysAgo,
        },
      },
      data: {
        status: OrderStatus.COMPLETED,
      },
    });
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

cron.schedule('0 0 * * *', autoCompletedOrder, {
  scheduled: true,
  timezone: 'Asia/Jakarta',
});

console.log('Cron job scheduled to update order status daily at midnight.');
