import { prisma } from '../configs/prisma.js';
import { Request, Response, NextFunction } from 'express';
import { DiscountType } from '@prisma/client';

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
    const product = await prisma.storeProduct.findFirst({
      where: { productId },
      include: { product: true },
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    let discountType = type;
    let valueDiscount = value;

    const discount = await prisma.discount.create({
      data: {
        name,
        type: discountType,
        value: valueDiscount,
        minPurchase,
        maxDiscount,
        expiredAt: new Date(expiredAt),
        DiscountProduct: {
          create: {
            productId,
          },
        },
      },
    });

    if (buyOneGetOne) {
      discountType = DiscountType.AMOUNT;
      valueDiscount = Number(product.price) / 2;
    }

    if (DiscountType.AMOUNT || DiscountType.PERCENTAGE) {
      let newPrice = Number(product.price);

      if (discountType === 'AMOUNT') {
        newPrice = newPrice - valueDiscount;

        if (newPrice > maxDiscount) {
          newPrice = maxDiscount;
        }
      } else if (DiscountType.PERCENTAGE) {
        newPrice -= (newPrice * valueDiscount) / 100;

        if (newPrice > maxDiscount) {
          newPrice = maxDiscount;
        }
      }

      const storeProduct = await prisma.storeProduct.findFirst({
        where: { productId },
      });

      if (!storeProduct) {
        throw new Error('Product not found');
      }

      if (discount.isActive) {
        await prisma.storeProduct.update({
          where: { id: storeProduct.id },
          data: { price: newPrice },
        });
      }
    }

    res.status(201).json({
      ok: true,
      message: 'Discount created and applied to product successfully',
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
        discount: true,
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const deactivateDiscount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountId } = req.params;
    const discount = await prisma.discount.update({
      where: { id: Number(discountId) },
      data: { isActive: false },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    res.status(200).json({ message: 'Discount deactivated successfully' });
  } catch (error) {
    next(error);
  }
};

//mantap
