import { prisma } from '../configs/prisma.js';
import { Request, Response, NextFunction } from 'express';
import { DiscountType } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/*                  CONTROLLER YANG BERHASIL YANG DIKOMENTAR                  */
/* -------------------------------------------------------------------------- */
export const createDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    productId,
    name,
    buyOneGetOne = false,
    type,
    value,
    minPurchase,
    maxDiscount,
    expiredAt,
  } = req.body;

  if (
    !productId ||
    !name ||
    !type ||
    !value ||
    !minPurchase ||
    !maxDiscount ||
    !expiredAt
  ) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    let discountType = type;
    let valueDiscount = value;

    await prisma.discount.create({
      data: {
        name,
        type: discountType,
        value: valueDiscount,
        minPurchase,
        maxDiscount,
        expiredAt: new Date(expiredAt),
        DiscountProduct: {
          create: {
            productId: Number(productId),
          },
        },
      },
    });

    const storeProducts = await prisma.storeProduct.findMany({
      where: { productId: Number(productId) },
    });

    /* -------------------------------------------------------------------------- */
    /*                            JIKA BUY ONE GET ONE                            */
    /* -------------------------------------------------------------------------- */
    if (buyOneGetOne) {
      discountType = DiscountType.AMOUNT;
      valueDiscount = 1 / 2;
      for (const product of storeProducts) {
        const updatedPrice = +product.price * valueDiscount;
        await prisma.storeProduct.update({
          where: { id: product.id },
          data: {
            priceAfterDiscount: updatedPrice,
            backupPrice: updatedPrice,
          },
        });
      }
    }
    /* -------------------------------------------------------------------------- */
    /*                          JIKA DISCOUNT TYPE AMOUNT                         */
    /* -------------------------------------------------------------------------- */

    if (discountType === DiscountType.AMOUNT) {
      if (valueDiscount > maxDiscount) {
        valueDiscount = maxDiscount;
        for (const product of storeProducts) {
          const updatedPrice = +product.price - valueDiscount;
          await prisma.storeProduct.update({
            where: { id: product.id },
            data: {
              priceAfterDiscount: updatedPrice,
              backupPrice: updatedPrice,
            },
          });
        }
      }
    }

    /* -------------------------------------------------------------------------- */
    /*                        JIKA DISCOUNT TYPE PERCENTAGE                       */
    /* -------------------------------------------------------------------------- */

    if (discountType === DiscountType.PERCENTAGE) {
      for (const product of storeProducts) {
        const updatedPrice =
          +product.price - (+product.price * valueDiscount) / 100;
        await prisma.storeProduct.update({
          where: { id: product.id },
          data: {
            priceAfterDiscount: updatedPrice,
            backupPrice: updatedPrice,
          },
        });
      }
    }

    // --------------------------------------------------------------------------

    res.status(201).json({
      ok: true,
      message: 'Discount created and applied successfully',
    });
  } catch (error) {
    next(error);
  }
};

// export const createDiscount = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const {
//     productId,
//     name,
//     buyOneGetOne = false,
//     type,
//     value,
//     minPurchase,
//     maxDiscount,
//     expiredAt,
//   } = req.body;

//   if (
//     !productId ||
//     !name ||
//     !type ||
//     !value ||
//     !minPurchase ||
//     !maxDiscount ||
//     !expiredAt
//   ) {
//     res.status(400).json({ message: 'Missing required fields' });
//     return;
//   }

//   try {
//     // 1. Buat diskon
//     await prisma.discount.create({
//       data: {
//         name,
//         type,
//         value,
//         minPurchase,
//         maxDiscount,
//         expiredAt: new Date(expiredAt),
//         DiscountProduct: {
//           create: {
//             productId: Number(productId),
//           },
//         },
//       },
//     });

//     // 2. Ambil semua storeProduct yang sesuai
//     const storeProducts = await prisma.storeProduct.findMany({
//       where: { productId: Number(productId) },
//     });

//     // 3. Proses diskon Buy One Get One
//     if (buyOneGetOne) {
//       for (const product of storeProducts) {
//         const updatedPrice = +product.price * 0.5;
//         await prisma.storeProduct.update({
//           where: { id: product.id },
//           data: {
//             priceAfterDiscount: updatedPrice,
//             backupPrice: updatedPrice,
//           },
//         });
//       }
//     }

//     // 4. Proses diskon berdasarkan tipe
//     if (type === DiscountType.AMOUNT) {
//       const discountValue = Math.min(value, maxDiscount); // jaga-jaga kalau value lebih besar dari max
//       for (const product of storeProducts) {
//         const updatedPrice = Math.max(0, +product.price - discountValue);
//         await prisma.storeProduct.update({
//           where: { id: product.id },
//           data: {
//             priceAfterDiscount: updatedPrice,
//             backupPrice: updatedPrice,
//           },
//         });
//       }
//     }

//     if (type === DiscountType.PERCENTAGE) {
//       for (const product of storeProducts) {
//         const discountAmount = (+product.price * value) / 100;
//         const updatedPrice = Math.max(0, +product.price - discountAmount);
//         await prisma.storeProduct.update({
//           where: { id: product.id },
//           data: {
//             priceAfterDiscount: updatedPrice,
//             backupPrice: updatedPrice,
//           },
//         });
//       }
//     }

//     res.status(201).json({
//       ok: true,
//       message: 'Discount created and applied successfully',
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const deactivateDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountId } = req.params;

    if (!discountId) {
      res.status(400).json({ message: 'Discount ID is required' });
      return;
    }

    const discount = await prisma.discount.findUnique({
      where: { id: Number(discountId) },
      include: {
        DiscountProduct: true,
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    await prisma.discount.update({
      where: { id: discount.id },
      data: {
        isActive: false,
      },
    });

    const storeProducts = await prisma.storeProduct.findMany({
      where: { productId: discount.DiscountProduct[0].productId },
    });

    for (const product of storeProducts) {
      await prisma.storeProduct.update({
        where: { id: product.id },
        data: {
          priceAfterDiscount: 0,
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Discount deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const activateDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountId } = req.params;

    if (!discountId) {
      res.status(400).json({ message: 'Discount ID is required' });
      return;
    }

    const discount = await prisma.discount.findUnique({
      where: { id: Number(discountId) },
      include: {
        DiscountProduct: true,
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    const storeProducts = await prisma.storeProduct.findMany({
      where: { productId: discount.DiscountProduct[0].productId },
    });

    for (const product of storeProducts) {
      if (product.backupPrice) {
        await prisma.storeProduct.update({
          where: { id: product.id },
          data: {
            priceAfterDiscount: +product.backupPrice,
          },
        });
      }
    }

    await prisma.discount.update({
      where: { id: discount.id },
      data: {
        isActive: true,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Discount activated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllDiscounts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discounts = await prisma.discount.findMany({
      include: {
        DiscountProduct: true,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Discounts found successfully',
      data: discounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountId } = req.params;

    if (!discountId) {
      res.status(400).json({ message: 'Discount ID is required' });
      return;
    }

    const discount = await prisma.discount.findUnique({
      where: { id: Number(discountId) },
      include: {
        DiscountProduct: {
          include: {
            Product: true,
          },
        },
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Discount found successfully',
      data: discount,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountForProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    const discount = await prisma.discount.findMany({
      where: {
        isActive: true,
        DiscountProduct: {
          some: {
            productId: Number(productId),
          },
        },
      },
      include: {
        DiscountProduct: true,
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Discount found successfully',
      data: discount,
    });
  } catch (error) {
    next(error);
  }
};
export const getDiscountReport = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const reports = await prisma.discountReport.findMany({
      include: {
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Discount reports found successfully',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};
