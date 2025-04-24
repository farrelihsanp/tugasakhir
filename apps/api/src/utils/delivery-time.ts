import cron from 'node-cron';
import { prisma } from '../configs/prisma.js';
import { OrderStatus } from '@prisma/client';

const updateOrderStatus = async () => {
  try {
    const shippedOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.SHIPPED,
      },
      include: {
        shippingInformation: true,
      },
    });

    for (const order of shippedOrders) {
      const estimatedTime = order.shippingInformation?.estimatedTime;

      if (estimatedTime) {
        if (typeof estimatedTime !== 'number' || estimatedTime <= 0) {
          console.warn(
            `Invalid estimatedTime for order ID ${order.id}: ${estimatedTime}`,
          );
          continue;
        }

        const shippingAt = order.shippingAt;
        const estimatedDeliveryTime = shippingAt
          ? new Date(
              shippingAt.getTime() + estimatedTime * 1000 * 60 * 60 * 60 * 24,
            )
          : null;
        const currentTime = new Date();

        if (estimatedDeliveryTime) {
          if (currentTime > new Date(estimatedDeliveryTime.getTime())) {
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: OrderStatus.DELIVERED,
                deliveredAt: new Date(),
              },
            });
            console.log(`Order ID ${order.id} status updated to DELIVERED.`);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }
};

cron.schedule('* * * * *', updateOrderStatus, {
  scheduled: true,
  timezone: 'Asia/Jakarta',
});
console.log('Cron job scheduled to update order status every minute.');

// setInterval(updateOrderStatus, 5000); // 5000ms = 5 detik
// new Date(shippingAt.getTime() + estimatedTime * 1000 * 60 * 60 * 24);
