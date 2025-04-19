import cron from 'node-cron';
import { prisma } from '../configs/prisma.js';
import { OrderStatus } from '@prisma/client';

const autoCompletedOrder = async () => {
  try {
    // Calculate the date 7 days ago from now
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Update orders that have been delivered more than 7 days ago
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

// Schedule the cron job to run daily at midnight (0 0 * * *)
cron.schedule('0 0 * * *', autoCompletedOrder, {
  scheduled: true,
  timezone: 'Asia/Jakarta',
});

console.log('Cron job scheduled to update order status daily at midnight.');
