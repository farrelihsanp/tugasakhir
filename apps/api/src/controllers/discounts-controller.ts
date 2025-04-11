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
      where: { productId: Number(productId) },
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
        priceBeforeDiscount: Number(product.price),
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

    if (buyOneGetOne) {
      discountType = DiscountType.AMOUNT;
      valueDiscount = Number(product.price) / 2;
    }
    let newPrice = Number(product.price);
    if (DiscountType.AMOUNT || DiscountType.PERCENTAGE) {
      if (discountType === 'AMOUNT') {
        newPrice = newPrice - valueDiscount;

        if (newPrice > maxDiscount) {
          newPrice = maxDiscount;
        }
      } else if (DiscountType.PERCENTAGE) {
        newPrice = newPrice - (newPrice * valueDiscount) / 100;

        if (newPrice > maxDiscount) {
          newPrice = maxDiscount;
        }
      }

      const storeProduct = await prisma.storeProduct.findFirst({
        where: { productId: Number(productId) },
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

    const finalData = await prisma.discount.update({
      where: { id: discount.id },
      data: { priceAfterDiscount: newPrice },
    });

    res.status(201).json({
      ok: true,
      message: 'Discount created and applied to product successfully',
      data: finalData,
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

    res.status(200).json({
      ok: true,
      message: 'Discount reports found successfully',
      data: reports,
    });
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

    if (!discountId) {
      res.status(400).json({ message: 'Discount ID is required' });
      return;
    }

    const discount = await prisma.discount.findUnique({
      where: { id: Number(discountId) },
      include: {
        DiscountProduct: {
          select: {
            productId: true,
          },
        },
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    await prisma.discount.update({
      where: { id: Number(discountId) },
      data: { isActive: false },
    });

    const storeProduct = await prisma.storeProduct.findFirst({
      where: { productId: discount.DiscountProduct[0].productId },
    });

    if (!storeProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const finalData = await prisma.storeProduct.update({
      where: { id: storeProduct.id },
      data: { price: discount.priceBeforeDiscount },
    });

    res.status(200).json({
      ok: true,
      message: 'Discount deactivated successfully',
      data: finalData,
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
        DiscountProduct: {
          select: {
            productId: true,
          },
        },
      },
    });

    if (!discount) {
      res.status(404).json({ message: 'Discount not found' });
      return;
    }

    await prisma.discount.update({
      where: { id: Number(discountId) },
      data: { isActive: true },
    });

    const storeProduct = await prisma.storeProduct.findFirst({
      where: { productId: discount.DiscountProduct[0].productId },
    });

    if (!storeProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (!discount.priceAfterDiscount) {
      res.status(404).json({ message: 'Discount price not found' });
      return;
    }

    const finalData = await prisma.storeProduct.update({
      where: { id: storeProduct.id },
      data: { price: discount.priceAfterDiscount },
    });

    res.status(200).json({
      ok: true,
      message: 'Discount activated successfully',
      data: finalData,
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
        DiscountProduct: {
          select: {
            productId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
          select: {
            productId: true,
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
