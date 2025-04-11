import { Request, Response, NextFunction } from 'express';
// import { MidtransClient } from 'midtrans-node-client';
import { prisma } from '../configs/prisma.js';
// import { v4 as uuid } from 'uuid';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { OrderStatus, PaymentMethodType, typeOfChange } from '@prisma/client';
// import { Product } from '../types/express.js';

// const snap = new MidtransClient.Snap({
//   isProduction: false,
//   serverKey: process.env.MIDTRANS_SERVER_KEY,
// });

/* -------------------------------------------------------------------------- */
/*                                  COSTUMER                                  */
/* -------------------------------------------------------------------------- */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { storeSlug } = req.params;

    const store = await prisma.store.findFirst({
      where: { slug: storeSlug },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    if (!storeSlug) {
      res.status(400).json({ error: 'Store slug is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cartBuyerCustomer = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cartBuyerCustomer) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const hasilBelanjaan = await prisma.cartItem.findMany({
      where: { cartId: cartBuyerCustomer.id },
      include: {
        storeProduct: {
          include: { product: true },
        },
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
      shippingCostAfterVoucher,
      estimatedTime,
    } = req.body;

    if (
      !courierName ||
      !serviceType ||
      !shippingCostAfterVoucher ||
      !code ||
      !description ||
      !estimatedTime
    ) {
      res
        .status(400)
        .json({ error: 'Courier name, service, and cost are required' });
      return;
    }

    const shippingAddress = await prisma.address.findFirst({
      where: { userId: userId, isPrimary: true },
    });

    if (!shippingAddress) {
      res.status(400).json({ error: 'No Primary shipping address found' });
      return;
    }

    // Create slug
    const createSlug = (input: string): string => {
      const randomNumber = Math.floor(Math.random() * 1000);
      const formattedRandomNumber = randomNumber.toString().padStart(3, '0');
      const fullInput = `${input}-${formattedRandomNumber}`;
      return fullInput;
    };

    // const orderId = uuid();

    const newOrder = await prisma.order.create({
      data: {
        userId: userId,
        storeId: store.id,
        shippingAddressId: shippingAddress.id,
        totalAmount: cartBuyerCustomer.totalAmount + shippingCostAfterVoucher,
        slug: createSlug('ORDER'),
        paymentMethodType: PaymentMethodType.UNSET,
        status: OrderStatus.WAITING_FOR_PAYMENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.orderItem.createMany({
      data: hasilBelanjaan.map((item) => ({
        orderId: newOrder.id,
        storeProductId: item.storeProductId,
        productId: item.storeProduct.productId,
        price: Number(item.price),
        quantity: item.quantity,
        total: Number(item.total),
      })),
    });

    for (const item of hasilBelanjaan) {
      const storeProductId = item.storeProductId;
      const quantityPurchased = item.quantity;

      await prisma.storeProduct.update({
        where: { id: storeProductId },
        data: {
          stock: {
            decrement: quantityPurchased,
          },
        },
      });
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cartBuyerCustomer.id },
    });

    const extractFirstNumber = (str: string): number | null => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };
    let firstNumberEstimatedTime = extractFirstNumber(estimatedTime);
    if (firstNumberEstimatedTime === null) {
      console.warn('No valid number found in estimatedTime:', estimatedTime);
      firstNumberEstimatedTime = 0;
    }

    await prisma.shippingInformation.create({
      data: {
        orderId: newOrder.id,
        courierName: courierName,
        code: code,
        serviceType: serviceType,
        description: description,
        shippingCost: shippingCostAfterVoucher,
        estimatedTime: firstNumberEstimatedTime,
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

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        paymentMethodType: PaymentMethodType.BANK_TRANSFER,
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

// export const payWithMidTrans = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const newOrder = await createOrder(req, res, next);

//     if (!newOrder) {
//       res.status(400).json({ error: 'Order creation failed' });
//       return;
//     }

//     await prisma.order.update({
//       where: { id: newOrder.id },
//       data: {
//         paymentMethodType: PaymentMethodType.MIDTRANS,
//       },
//     });

//     const customer = await prisma.user.findUnique({
//       where: { id: newOrder.userId },
//     });

//     if (!customer) {
//       res.status(400).json({ error: 'User not found' });
//       return;
//     }

//     const orderItems = await prisma.orderItem.findMany({
//       where: { orderId: newOrder.id },
//       include: { storeProduct: { include: { product: true } } },
//     });

//     if (!orderItems) {
//       res.status(400).json({ error: 'Order items not found' });
//       return;
//     }

//     const item_details = orderItems.map((item) => ({
//       id: item.productId!,
//       name: item.storeProduct.product.name,
//       price: (item.storeProduct.product as Product).price,
//       quantity: item.quantity,
//     }));

//     const parameter = {
//       transaction_details: {
//         order_id: newOrder.id.toString(),
//         gross_amount: newOrder.totalAmount,
//       },
//       item_details,
//       customer_details: {
//         first_name: customer.name,
//         email: customer.email,
//       },
//       callbacks: {
//         finish: 'http://localhost:3000',
//       },
//     };

//     const transaction = await snap.createTransaction(parameter);

//     res.status(201).json({ ok: true, data: { order: newOrder, transaction } });
//   } catch (error) {
//     console.error('Error during Midtrans payment:', error);
//     next(error);
//   }
// };

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
    const { orderId } = req.body;
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
    const { orderId } = req.body;
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

    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
/* -------------------------------------------------------------------------- */
/*                                 STOREADMIN & SUPERADMIN                                */
/* -------------------------------------------------------------------------- */

export const getAllOrdersStatusPending = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING_PAYMENT,
      },
      include: {
        user: true,
      },
    });
    res.status(200).json(orders);
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

    // Persiapkan data untuk createMany
    const productChangesData = orderCostumer.orderItems.map((item) => ({
      orderId: orderCostumer.id,
      userId: userId,
      productId: item.storeProduct.product.id,
      stock: item.quantity,
      lastStock: item.storeProduct.stock,
      typeOfChange: typeOfChange.PEMBELIAN,
    }));

    await prisma.productChangeData.createMany({
      data: productChangesData,
    });

    await prisma.order.update({
      where: { id: orderCostumer.id },
      data: {
        status: 'PROCESSING',
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

/* -------------------------------------------------------------------------- */
/*                            FOR CUSTOMER & ADMIN                            */
/* -------------------------------------------------------------------------- */
export const getOrderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { slug } = req.params;

    const order = await prisma.order.findFirst({
      where: { slug },
      include: {
        user: { select: { name: true } },
        store: { select: { name: true } },
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

    const formattedItems = order.orderItems.map((item) => {
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

    const totalFromItems = order.orderItems.reduce((acc, item) => {
      return acc + item.total;
    }, 0);

    res.status(200).json({
      ok: true,
      data: {
        customerName: order.user.name,
        storeName: order.store.name,
        status: order.status,
        totalAmount: order.totalAmount,
        totalCalculated: totalFromItems,
        items: formattedItems,
      },
    });
  } catch (error) {
    console.error('Error getting order detail:', error);
    next(error);
  }
};
