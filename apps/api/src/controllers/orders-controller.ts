import { Request, Response, NextFunction } from 'express';
import { MidtransClient } from 'midtrans-node-client';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import {
  OrderStatus,
  PaymentMethodType,
  typeOfChange,
  Role,
} from '@prisma/client';
import { updateOrderStatus } from '../helpers/update-order-status.js';

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { storeSlug } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!storeSlug) {
      res.status(400).json({ error: 'Store slug is required' });
      return;
    }

    const store = await prisma.store.findFirst({ where: { slug: storeSlug } });
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const cartBuyerCustomer = await prisma.cart.findUnique({
      where: { userId },
      include: { CartValueCalculation: true, cartItems: true },
    });

    if (!cartBuyerCustomer) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const hasilBelanjaan = await prisma.cartItem.findMany({
      where: { cartId: cartBuyerCustomer.id },
      include: {
        storeProduct: { include: { product: true } },
      },
    });

    if (hasilBelanjaan.length === 0) {
      res.status(400).json({ error: 'No items in the cart' });
      return;
    }

    const {
      courierName,
      code,
      serviceType,
      description,
      shippingCostFinal,
      estimatedTime,
    } = req.body;

    // if (
    //   !courierName ||
    //   !code ||
    //   !serviceType ||
    //   !description ||
    //   !shippingCostFinal ||
    //   !estimatedTime
    // ) {
    //   res.status(400).json({
    //     error:
    //       'Courier name, code, service type, description, shipping cost, and estimated time are required',
    //   });
    //   return;
    // }

    const shippingAddress = await prisma.address.findFirst({
      where: { userId, isPrimary: true },
    });

    if (!shippingAddress) {
      res.status(400).json({ error: 'No Primary shipping address found' });
      return;
    }

    // Helper slug
    const createSlug = (input: string): string => {
      const rand = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0');
      return `${input}-${rand}`;
    };

    const orderId = Math.floor(Math.random() * 1000000);
    const totalAmount =
      cartBuyerCustomer.CartValueCalculation?.totalAmountCart || 0;
    const totalAmountAfterVoucher =
      cartBuyerCustomer.CartValueCalculation?.totalAmountCartAfterVoucher || 0;

    const newOrder = await prisma.order.create({
      data: {
        id: orderId,
        userId,
        storeId: store.id,
        shippingAddressId: shippingAddress.id,
        totalAmount:
          (totalAmountAfterVoucher || totalAmount) + shippingCostFinal,
        slug: createSlug('ORDER'),
        paymentMethodType: PaymentMethodType.UNSET,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // ---

    const totalDiscountBenefit = cartBuyerCustomer.cartItems.reduce(
      (a, b) => a + (b.priceAfterDiscount || 0) * b.quantity,
      0,
    );

    await prisma.discountReport.createMany({
      data: {
        userId: userId,
        orderId: newOrder.id,
        customerBenefits: totalDiscountBenefit,
      },
    });

    // ---

    await prisma.orderItem.createMany({
      data: hasilBelanjaan.map((item) => {
        const isDiscounted = Number(item.priceAfterDiscount) > 0;
        const usedPrice = isDiscounted
          ? Number(item.priceAfterDiscount)
          : Number(item.price);
        const usedTotal = isDiscounted
          ? Number(item.totalAfterDiscount)
          : Number(item.total);

        return {
          orderId: newOrder.id,
          storeProductId: item.storeProductId,
          productId: item.storeProduct.productId,
          price: usedPrice,
          quantity: item.quantity,
          total: usedTotal,
        };
      }),
    });

    for (const item of hasilBelanjaan) {
      await prisma.storeProduct.update({
        where: { id: item.storeProductId },
        data: {
          stock: { decrement: item.quantity },
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cartBuyerCustomer.id },
    });

    const extractFirstNumber = (str: string): number => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };

    const firstNumberEstimatedTime = extractFirstNumber(estimatedTime);

    await prisma.shippingInformation.create({
      data: {
        orderId: newOrder.id,
        courierName: courierName || '',
        code: code || '',
        serviceType: serviceType || '',
        description: description || '',
        shippingCost: shippingCostFinal || 0,
        estimatedTime: firstNumberEstimatedTime || 1,
      },
    });

    const orderFinal = await prisma.order.findUnique({
      where: { id: newOrder.id },
      include: {
        shippingInformation: true,
        orderItems: {
          include: {
            storeProduct: {
              include: { product: true },
            },
          },
        },
      },
    });

    res.status(201).json({
      ok: true,
      message: 'Order created successfully',
      data: orderFinal,
    });
  } catch (error) {
    console.error('Error during order creation:', error);
    next(error);
  }
};

export const payWithManualTransfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const updatedAt = order.updatedAt ? order.updatedAt : new Date();

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
        updatedAt,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Update payment method to Manual Transfer successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const payWithMidTrans = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId || !orderId) {
      res.status(401).json({ error: 'Unauthorized or Order ID is required' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { shippingInformation: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        paymentMethodType: PaymentMethodType.MIDTRANS,
      },
    });

    const customer = await prisma.user.findFirst({
      where: { orders: { some: { id: Number(orderId) } } },
    });

    if (!customer) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: Number(orderId) },
      include: { storeProduct: { include: { product: true } } },
    });

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ error: 'Order items not found' });
      return;
    }

    const ShippingCost = order?.shippingInformation?.shippingCost;

    const item_details = orderItems.map((item) => {
      const price = item.storeProduct.price;
      return {
        id: item.productId!,
        name: item.storeProduct.product.name,
        price: Number(price),
        quantity: item.quantity,
      };
    });

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: order.totalAmount,
      },
      item_details: Number(item_details) + Number(ShippingCost),
      customer_details: {
        first_name: customer.name,
        email: customer.email,
      },
      callbacks: {
        finish: `${process.env.WEB_DOMAIN}`,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    const finalOrder = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: {
        shippingInformation: true,
        orderItems: {
          include: {
            storeProduct: {
              include: {
                product: {
                  include: {
                    ProductImages: { select: { imageUrl: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    res
      .status(201)
      .json({ ok: true, data: { order: finalOrder, transaction } });
  } catch (error) {
    console.error('Error during Midtrans payment:', error);
    next(error);
  }
};

export const orderNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const data = req.body;
  try {
    updateOrderStatus(data);
    res.status(200).json({ ok: true, message: 'Order status updated' });
  } catch (error) {
    next(error);
  }
};

export const uploadPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (order.paymentMethodType !== PaymentMethodType.BANK_TRANSFER) {
      res.status(400).json({ error: 'Payment method is not Bank Transfer' });
      return;
    }

    const timeElapsed = new Date().getTime() - order.updatedAt.getTime();
    const hoursElapsed = timeElapsed / (1000 * 3600);

    if (hoursElapsed > 24) {
      await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: OrderStatus.CANCELLED },
      });

      res.status(400).json({
        error: 'Payment proof upload time expired. Order has been cancelled.',
      });
      return;
    }

    // --------------------------------------------------------------------------
    let paymentProofUrl = null;

    if (req.file?.path) {
      try {
        const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'order_transfers',
        });
        paymentProofUrl = cloudinaryData.secure_url;
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        res.status(500).json({ error: 'Failed to upload payment proof image' });
        return;
      }
    } else {
      res.status(400).json({ error: 'No payment proof image provided' });
      return;
    }

    // --------------------------------------------------------------------------

    // --------------------------------------------------------------------------

    await prisma.order.update({
      where: { id: +orderId },
      data: {
        paymentProof: paymentProofUrl,
        status: OrderStatus.PENDING_PAYMENT,
        paymentProofUploadedAt: new Date(),
      },
    });

    res.status(200).json({ ok: true, message: 'Payment proof uploaded' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const allowedStatuses: OrderStatus[] = [
      OrderStatus.WAITING_FOR_PAYMENT,
      OrderStatus.PENDING_PAYMENT,
      OrderStatus.PAYMENT_DECLINED,
    ];

    if (!allowedStatuses.includes(orderCostumer.status)) {
      res
        .status(400)
        .json({ error: 'Order cannot be cancelled in the current status' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.CANCELLED,
      },
    });

    const BelanjaanCostumer = await prisma.orderItem.findMany({
      where: {
        orderId: orderCostumer.id,
      },
    });

    if (!BelanjaanCostumer) {
      res.status(404).json({ error: 'Belanjaan not found' });
      return;
    }

    for (const item of BelanjaanCostumer) {
      await prisma.storeProduct.update({
        where: { id: item.storeProductId },
        data: {
          stock: {
            increment: item.quantity,
          },
        },
      });
    }

    await prisma.discountReport.deleteMany({
      where: {
        orderId: orderCostumer.id,
      },
    });

    await prisma.order.delete({
      where: { id: orderCostumer.id },
    });

    res.status(200).json({ ok: true, message: 'Order cancelled' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const orderConfirmed = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.COMPLETED,
        orderConfirmationAt: new Date(),
      },
    });
    res.status(200).json({ ok: true, message: 'Order confirmed' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllOrderCustomer = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        store: true,
      },
    });

    res.status(200).json({ ok: true, message: 'Orders found', data: orders });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOrderCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const order = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        store: true,
        orderItems: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ ok: true, message: 'Order found', data: order });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                          STOREADMIN DAN SUPERADMIN                         */
/* -------------------------------------------------------------------------- */

export const getAllOrdersStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { storeId } = req.params;

    const allOrder = await prisma.order.findMany({
      where: {
        storeId: Number(storeId),
      },
      include: {
        user: true,
        orderItems: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!allOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json(allOrder);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const seePaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
      select: {
        paymentProof: true,
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (!orderCostumer.paymentProof) {
      res.status(404).json({ error: 'Payment proof not found' });
      return;
    }

    const photoPaymentProof = orderCostumer.paymentProof;

    res.status(200).json({
      ok: true,
      message: 'Payment proof found',
      data: photoPaymentProof,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const acceptPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.PAID,
      },
    });

    res.status(200).json({ ok: true, message: 'Payment proof accepted' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const rejectPaymentProof = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.PAYMENT_DECLINED,
      },
    });

    res.status(200).json({ ok: true, message: 'Payment proof rejected' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const processOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
      include: {
        orderItems: {
          include: {
            storeProduct: {
              include: {
                product: {
                  include: {
                    CategoryProduct: {
                      include: {
                        Category: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    // ---
    if (orderCostumer.paymentMethodType === PaymentMethodType.BANK_TRANSFER) {
      const paymentProofCostumer = await prisma.order.findFirst({
        where: {
          id: Number(orderId),
        },
        select: {
          paymentProof: true,
        },
      });

      if (!paymentProofCostumer) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      if (!paymentProofCostumer.paymentProof) {
        res.status(404).json({ error: 'Customer payment proof not found' });
        return;
      }
    }

    // -----

    const productChangesData = orderCostumer.orderItems.map((item) => ({
      orderId: orderCostumer.id,
      userId: userId,
      productId: item.storeProduct.product.id,
      stock: item.quantity,
      lastStock: item.storeProduct.stock,
      difference: item.storeProduct.stock - item.quantity,
      typeOfChange: typeOfChange.PEMBELIAN,
      role: Role.CUSTOMERS,
      storeId: item.storeProduct.storeId,
      finalStock: item.storeProduct.stock - item.quantity,
    }));

    await prisma.productChangeData.createMany({
      data: productChangesData,
    });

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.PROCESSING,
      },
    });

    res.status(200).json({ message: 'Order processed successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sentOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const shippedOrder = await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.SHIPPED,
        shippingAt: new Date(),
      },
    });

    if (!shippedOrder) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.status(200).json({ ok: true, message: 'Order sent' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllOrderHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month, year, storeId } = req.query;

    const parsedMonth = parseInt(month as string, 10);
    const parsedYear = parseInt(year as string, 10);

    if (isNaN(parsedMonth) || isNaN(parsedYear)) {
      res.status(400).json({ error: 'Month and Year must be valid numbers' });
      return;
    }

    const startDate = new Date(parsedYear, parsedMonth - 1, 1);
    const endDate = new Date(parsedYear, parsedMonth, 0, 23, 59, 59, 999);

    const orders = await prisma.order.findMany({
      where: {
        ...(storeId ? { storeId: Number(storeId) } : {}),
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
        store: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const formatted = orders.map((order) => ({
      orderId: order.id,
      user: order.user.name,
      status: order.status,
      tanggal: order.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      store: order.store.name,
      slug: order.slug,
    }));

    res.status(200).json({ ok: true, data: formatted });
  } catch (error) {
    console.error('Error getting order history:', error);
    next(error);
  }
};

export const confirmationOrderCostumer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const orderCostumer = await prisma.order.findFirst({
      where: {
        id: Number(orderId),
      },
    });

    if (!orderCostumer) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: OrderStatus.COMPLETED,
      },
    });

    res.status(200).json({ ok: true, message: 'Order confirmed' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                            FOR CUSTOMER & ADMIN                            */
/* -------------------------------------------------------------------------- */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: { id: Number(orderId) },
      include: {
        user: { select: { name: true } },
        store: { select: { name: true } },
        shippingInformation: true,
        orderItems: {
          include: {
            storeProduct: {
              include: {
                product: {
                  include: {
                    ProductImages: { select: { imageUrl: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    order.orderItems.map((item) => {
      const product = item.storeProduct.product;
      const image = product.ProductImages[0]?.imageUrl || null;

      return {
        name: product.name,
        pricePerItem: item.price,
        quantity: item.quantity,
        total: item.total,
        image,
      };
    });

    res.status(200).json({ ok: true, message: 'Success', data: order });
  } catch (error) {
    console.error('Error getting order detail:', error);
    next(error);
  }
};
