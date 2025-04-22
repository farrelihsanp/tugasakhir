import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { VoucherType, VoucherCategory } from '@prisma/client';

export const createVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const {
      name,
      description,
      code,
      voucherType,
      voucherCategory,
      value,
      startDate,
      endDate,
      stock,
      isActive,
      minPurchase,
      maxPriceReduction,
      productId,
      storeId,
    } = req.body;

    if (
      !name ||
      !code ||
      !voucherCategory ||
      !voucherType ||
      !value ||
      !startDate ||
      !endDate ||
      !stock
    ) {
      res.status(400).json({ error: 'All required fields are required' });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vouchers',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl };
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl };
    }

    const newVoucher = await prisma.voucher.create({
      data: {
        storeId: storeId ? Number(storeId) : null,
        name,
        description,
        code,
        stockVoucherAdmin: Number(stock),
        voucherCategory: voucherCategory as VoucherCategory,
        voucherType: voucherType as VoucherType,
        value: Number(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
        minPurchase: Number(minPurchase) || null,
        maxPriceReduction: Number(maxPriceReduction) || null,
        voucherImage: cloudinaryData.secure_url,
        VoucherProduct: productId
          ? {
              create: {
                productId: Number(productId),
              },
            }
          : undefined,
        VoucherUser: {
          create: {
            userId: Number(userId),
          },
        },
      },
    });

    res.status(201).json({
      ok: true,
      message: 'Voucher created successfully',
      data: newVoucher,
    });
  } catch (error) {
    console.error('Error creating voucher:', error);
    next(error);
  }
};

// Update an existing voucher
export const updateVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { voucherCode } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode },
      include: { VoucherProduct: true },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    const {
      name,
      description,
      voucherCategory,
      voucherType,
      value,
      startDate,
      endDate,
      stock,
      isActive,
      minPurchase,
      maxPriceReduction,
    } = req.body;

    if (
      !name ||
      !voucherCategory ||
      !voucherType ||
      !value ||
      !startDate ||
      !endDate ||
      !stock
    ) {
      res.status(400).json({ error: 'All required fields are required' });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vouchers',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl };
      }
    } else {
      cloudinaryData = { secure_url: voucher.voucherImage };
    }

    const updatedVoucher = await prisma.voucher.update({
      where: { code: voucherCode },
      data: {
        name,
        description,
        voucherCategory: voucherCategory as VoucherCategory,
        voucherType: voucherType as VoucherType,
        value: Number(value),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stockVoucherAdmin: Number(stock),
        isActive,
        minPurchase: minPurchase ? Number(minPurchase) : null,
        maxPriceReduction: maxPriceReduction ? Number(maxPriceReduction) : null,
        voucherImage: cloudinaryData.secure_url,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher updated successfully',
      data: updatedVoucher,
    });
  } catch (error) {
    console.error('Error updating voucher:', error);
    next(error);
  }
};

// Delete a voucher
export const deleteVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }
    const { voucherId } = req.body;

    if (!voucherId) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    const voucherToDelete = await prisma.voucher.findUnique({
      where: { id: Number(voucherId) },
    });

    if (!voucherToDelete) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    await prisma.voucher.delete({
      where: { id: Number(voucherId) },
    });
    res.status(200).json({ ok: true, message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a voucher by ID
export const getVoucherById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    const voucher = await prisma.voucher.findUnique({
      where: { id: Number(id) },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    res
      .status(200)
      .json({ ok: true, message: 'Voucher found successfully', data: voucher });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all vouchers
export const getAllVouchersUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const vouchers = await prisma.voucher.findMany({
      where: {
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        VoucherUser: true,
      },
    });

    if (!vouchers) {
      res.status(404).json({ error: 'Vouchers not found' });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Vouchers found successfully',
      data: vouchers,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllVouchersAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const vouchers = await prisma.voucher.findMany({
      where: {
        isActive: true,
        stockVoucherAdmin: { gt: 0 },
      },
    });

    if (!vouchers) {
      res.status(404).json({ error: 'Vouchers not found' });
      return;
    }
    res.status(200).json({
      ok: true,
      message: 'Vouchers found successfully',
      data: vouchers,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const claimVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const { claimVoucher } = req.body;

    const voucher = await prisma.voucher.findUnique({
      where: { code: claimVoucher },
      include: { VoucherUser: true },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    if (voucher.stockVoucherAdmin === 0) {
      res.status(400).json({ error: 'Voucher stock empty' });
      return;
    }

    // if (
    //   voucher.VoucherUser.some((voucherUser) => voucherUser.stockCustomer > 3)
    // ) {
    //   res.status(400).json({ error: 'Voucher max 3 stock' });
    //   return;
    // }

    // ---------------------------------------------------------------------- //

    await prisma.voucherUser.update({
      where: { id: voucher.id },
      data: {
        stockCustomer: {
          increment: 1,
        },
      },
    });

    await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        stockVoucherAdmin: {
          decrement: 1,
        },
      },
    });

    const voucherUser = await prisma.voucherUser.findUnique({
      where: { id: voucher.id },
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher claimed successfully',
      data: voucherUser,
    });
  } catch (error) {
    console.error('Error claiming voucher:', error);
    next(error);
  }
};

export const getVoucherByCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { voucherCode } = req.params;
    const voucher = await prisma.voucher.findUnique({
      where: { code: voucherCode },
    });

    if (!voucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Voucher found successfully',
      data: voucher,
    });
  } catch (error) {
    console.error('Error getting voucher by code:', error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                                APPLY VOUCHER                               */
/* -------------------------------------------------------------------------- */

export const applyVoucherToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { voucherId } = req.body;

    if (!voucherId) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cartUser = await prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const cartValueCalculation = await prisma.cartValueCalculation.findFirst({
      where: { cartId: cartUser.id },
    });

    if (!cartValueCalculation) {
      res.status(404).json({ error: 'not found model' });
      return;
    }

    const voucherSelectedToApply = await prisma.voucher.findFirst({
      where: {
        id: Number(voucherId),
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!voucherSelectedToApply) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }
    // --------------------------------------------------------------------------

    let finalAmountAfterVoucher = 0;

    const totalAmount = cartValueCalculation.totalAmountCart;

    if (
      voucherSelectedToApply.voucherCategory === VoucherCategory.SHOPPING_RESULT
    ) {
      if (voucherSelectedToApply.voucherType === 'AMOUNT') {
        const voucherValue = voucherSelectedToApply.value;
        finalAmountAfterVoucher = +totalAmount - voucherValue;

        if (+totalAmount < voucherValue || finalAmountAfterVoucher < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds total amount' });
          return;
        }
      } else if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
        const voucherValue = voucherSelectedToApply.value;
        finalAmountAfterVoucher = (+totalAmount * (100 - voucherValue)) / 100;

        const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;
        if (maxPriceReduction && finalAmountAfterVoucher > maxPriceReduction) {
          finalAmountAfterVoucher = maxPriceReduction;
        }

        if (finalAmountAfterVoucher < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds total amount' });
          return;
        }
      }

      const dataForUpdate = await prisma.cartValueCalculation.findFirst({
        where: { cartId: cartUser.id },
      });

      if (!dataForUpdate) {
        res.status(404).json({ error: 'Final calculation not found' });
        return;
      }

      await prisma.cartValueCalculation.update({
        where: { cartId: dataForUpdate.cartId },
        data: {
          totalAmountCartAfterVoucher: finalAmountAfterVoucher,
          valueVoucherCart:
            dataForUpdate.totalAmountCart - finalAmountAfterVoucher,
        },
      });

      const finalVoucher = await prisma.voucher.findFirst({
        where: {
          id: Number(voucherId),
          VoucherUser: {
            some: {
              userId: userId,
            },
          },
        },
      });

      if (!finalVoucher) {
        res.status(404).json({ error: 'Voucher not found' });
        return;
      }

      await prisma.voucherUser.updateMany({
        where: { voucherId: finalVoucher.id, userId },
        data: {
          stockCustomer: {
            decrement: 1,
          },
        },
      });

      await res.status(200).json({
        ok: true,
        message: 'Voucher applied to cart total successfully',
      });
    } else if (
      (voucherSelectedToApply.voucherCategory as string) !==
      VoucherCategory.SHOPPING_RESULT
    ) {
      res.status(400).json({ error: 'Voucher category is not valid' });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const applyVoucherToShippingCost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { voucherId, shippingCostSelected } = req.body;

    if (!voucherId) {
      res.status(400).json({ error: 'Voucher ID is required' });
      return;
    }

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cartUser = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const voucherSelectedToApply = await prisma.voucher.findFirst({
      where: {
        id: Number(voucherId),
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!voucherSelectedToApply) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    let finalShippingCost = 0;

    if (
      voucherSelectedToApply.voucherCategory === VoucherCategory.SHIPPING_COST
    ) {
      if (voucherSelectedToApply.voucherType === 'AMOUNT') {
        const voucherValue = voucherSelectedToApply.value;

        finalShippingCost = shippingCostSelected - voucherValue;

        if (shippingCostSelected < voucherValue || finalShippingCost < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds shipping cost' });
          return;
        }
      } else if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
        const voucherValue = voucherSelectedToApply.value;
        finalShippingCost = (shippingCostSelected * (100 - voucherValue)) / 100;

        const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;

        if (!maxPriceReduction) {
          res.status(400).json({ error: 'maxPriceReduction is required' });
          return;
        }

        if (finalShippingCost > maxPriceReduction) {
          finalShippingCost = maxPriceReduction;
        }

        if (finalShippingCost < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds shipping cost' });
          return;
        }
      }

      // -------------------------------------------

      const dataForUpdate = await prisma.cartValueCalculation.findFirst({
        where: { cartId: cartUser.id },
      });

      if (!dataForUpdate) {
        res.status(404).json({ error: 'Final calculation not found' });
        return;
      }

      const valueVoucherShipping = shippingCostSelected - finalShippingCost;

      await prisma.cartValueCalculation.update({
        where: { cartId: cartUser.id },
        data: {
          shippingCost: shippingCostSelected,
          shippingCostAfterVoucher: finalShippingCost,
          valueVoucherShipping: valueVoucherShipping,
        },
      });

      const finalVoucher = await prisma.voucher.findFirst({
        where: {
          id: Number(voucherId),
          VoucherUser: {
            some: {
              userId: userId,
            },
          },
        },
      });

      if (!finalVoucher) {
        res.status(404).json({ error: 'Voucher not found' });
        return;
      }

      await prisma.voucherUser.updateMany({
        where: { voucherId: finalVoucher.id, userId },
        data: {
          stockCustomer: {
            decrement: 1,
          },
        },
      });

      res.status(200).json({
        ok: true,
        message: 'Voucher applied to shipping cost successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const applyVoucherToProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { voucherId } = req.body;

    if (!voucherId || !userId) {
      res
        .status(400)
        .json({ error: 'Voucher ID, Product ID and user ID are required' });
      return;
    }

    const cartUser = await prisma.cart.findFirst({
      where: { userId },
      include: { cartItems: true },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const voucherSelectedToApply = await prisma.voucher.findFirst({
      where: {
        id: Number(voucherId),
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
      },
      include: { VoucherProduct: true },
    });

    if (!voucherSelectedToApply) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }
    const productId = voucherSelectedToApply?.VoucherProduct[0].productId;

    const cartItem = cartUser.cartItems.find(
      (item) => item.productId === productId,
    );

    if (!cartItem) {
      res.status(404).json({ error: 'Product not found in cartItems' });
      return;
    }

    // --------------------------------------------------------------------------
    const productPrice =
      Number(cartItem.priceAfterDiscount) || Number(cartItem.price);

    let finalAmountAfterVoucher = 0;

    if (voucherSelectedToApply.voucherCategory === VoucherCategory.PRODUCT) {
      if (voucherSelectedToApply.voucherType === 'AMOUNT') {
        const voucherValue = voucherSelectedToApply.value;
        finalAmountAfterVoucher = productPrice - voucherValue;

        if (productPrice < voucherValue || finalAmountAfterVoucher < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds total amount' });
          return;
        }
      } else if (voucherSelectedToApply.voucherType === 'PERCENTAGE') {
        const voucherValue = voucherSelectedToApply.value;
        finalAmountAfterVoucher = (productPrice * (100 - voucherValue)) / 100;

        const maxPriceReduction = voucherSelectedToApply.maxPriceReduction;
        if (maxPriceReduction && finalAmountAfterVoucher > maxPriceReduction) {
          finalAmountAfterVoucher = maxPriceReduction;
        }

        if (finalAmountAfterVoucher < 0) {
          res
            .status(400)
            .json({ error: 'Voucher amount exceeds total amount' });
          return;
        }
      }

      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          priceAfterVoucher: finalAmountAfterVoucher,
          valueVoucher: productPrice - finalAmountAfterVoucher,
          isVoucherApplied: true,
        },
      });

      // --------------------------------------------------------------------------

      const finalVoucher = await prisma.voucher.findFirst({
        where: {
          id: Number(voucherId),
          VoucherUser: {
            some: {
              userId: userId,
            },
          },
        },
      });

      if (!finalVoucher) {
        res.status(404).json({ error: 'Voucher not found' });
        return;
      }

      await prisma.voucherUser.updateMany({
        where: { voucherId: finalVoucher.id, userId },
        data: {
          stockCustomer: {
            decrement: 1,
          },
        },
      });

      res.status(200).json({
        ok: true,
        message: 'Voucher applied to cartitem total successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

export const removeVoucherFromCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { cartItemId } = req.body;

    if (!cartItemId) {
      res.status(400).json({ error: 'Cart item IDs are required' });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });

    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    if (!cartItem.isVoucherApplied) {
      res.status(400).json({ error: 'Voucher not applied to cart item' });
      return;
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: {
        priceAfterVoucher: null,
        valueVoucher: 0,
        isVoucherApplied: false,
      },
    });

    // ---

    const productId = cartItem.productId;

    if (!productId) {
      res.status(400).json({ error: 'Product ID is required' });
      return;
    }

    const finalVoucher = await prisma.voucher.findFirst({
      where: {
        VoucherProduct: {
          some: {
            productId: productId,
          },
        },
      },
    });

    if (!finalVoucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    await prisma.voucherUser.updateMany({
      where: { voucherId: finalVoucher.id },
      data: {
        stockCustomer: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Voucher removed from cartitem total successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const removeVoucher = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { voucherId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const cartUser = await prisma.cart.findFirst({
      where: { userId },
    });

    if (!cartUser) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const voucherRemove = await prisma.voucher.findFirst({
      where: {
        VoucherUser: { some: { userId: userId, voucherId: voucherId } },
      },
    });

    if (!voucherRemove) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    if (voucherRemove.voucherCategory === VoucherCategory.SHOPPING_RESULT) {
      await prisma.cartValueCalculation.update({
        where: { cartId: cartUser.id },
        data: {
          totalAmountCartAfterVoucher: 0,
          valueVoucherCart: 0,
        },
      });
    }

    if (voucherRemove.voucherCategory === VoucherCategory.SHIPPING_COST) {
      await prisma.cartValueCalculation.update({
        where: { cartId: cartUser.id },
        data: {
          shippingCostAfterVoucher: 0,
          valueVoucherShipping: 0,
        },
      });
    }

    const finalVoucher = await prisma.voucher.findFirst({
      where: {
        id: Number(voucherId),
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!finalVoucher) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    await prisma.voucherUser.updateMany({
      where: { voucherId: finalVoucher.id, userId },
      data: {
        stockCustomer: {
          increment: 1,
        },
      },
    });

    res.status(200).json({ ok: true, message: 'Voucher removed successfully' });
  } catch (error) {
    next(error);
  }
};
