import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export const addToCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user?.id;
    const { storeSlug } = req.params;

    if (!storeSlug) {
      res.status(400).json({ error: 'Store slug is required' });
      return;
    }
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!productId || !quantity) {
      res.status(400).json({ error: 'Product ID and quantity are required' });
      return;
    }

    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: Number(productId),
        storeId: Number(store.id),
      },
      include: { product: true },
    });

    if (!storeProduct) {
      res.status(404).json({ error: 'Store product not found' });
      return;
    }

    if (storeProduct.stock < quantity) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    const cart = await prisma.cart.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    // const priceToUse =
    //   storeProduct.priceAfterDiscount.toNumber() > 0
    //     ? storeProduct.priceAfterDiscount
    //     : storeProduct.price;

    let cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        storeProductId: storeProduct.id,
      },
    });

    const totalPrice = Number(storeProduct.price) * quantity;

    const totalPriceAfterDiscount =
      Number(storeProduct.priceAfterDiscount) * quantity;

    const priceAfterDiscount = Number(storeProduct.priceAfterDiscount);

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          total: cartItem.total + totalPrice,
          priceAfterDiscount: priceAfterDiscount > 0 ? priceAfterDiscount : 0,
          totalAfterDiscount:
            (cartItem.totalAfterDiscount || 0) +
            (totalPriceAfterDiscount ? totalPriceAfterDiscount : 0),
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          productId: storeProduct.productId,
          storeProductId: storeProduct.id,
          quantity,
          total: totalPrice,
          cartId: cart.id,
          price: Number(storeProduct.price),
          priceAfterDiscount: priceAfterDiscount ? priceAfterDiscount : 0,
          totalAfterDiscount: totalPriceAfterDiscount
            ? totalPriceAfterDiscount
            : 0,
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Product added to cart successfully',
      data: cartItem,
    });
    return;
  } catch (error) {
    console.error('Error adding product to cart:', error);
    next(error);
  }
};

export const increaseQuantityProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { cartItemId, quantity } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!cartItemId || !quantity) {
      res.status(400).json({ error: 'Cart item ID and quantity are required' });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { storeProduct: true },
    });

    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    const totalRequestedQuantity = cartItem.quantity + quantity;

    if (cartItem.storeProduct.stock < totalRequestedQuantity) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    const hasDiscount = Number(cartItem.storeProduct.priceAfterDiscount) > 0;

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: totalRequestedQuantity,
        total: Number(cartItem.storeProduct.price) * totalRequestedQuantity,
        totalAfterDiscount: hasDiscount
          ? Number(cartItem.storeProduct.priceAfterDiscount) *
            totalRequestedQuantity
          : null,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Quantity increased successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    next(error);
  }
};

export const decreaseQuantityProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { cartItemId, quantity } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!cartItemId || !quantity) {
      res.status(400).json({ error: 'Cart item ID and quantity are required' });
      return;
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { storeProduct: true },
    });

    if (!cartItem) {
      res.status(404).json({ error: 'Cart item not found' });
      return;
    }

    const newQuantity = cartItem.quantity - quantity;

    if (newQuantity < 1) {
      res.status(400).json({ error: 'Quantity must be at least 1' });
      return;
    }

    const hasDiscount = +cartItem.storeProduct.priceAfterDiscount > 0;

    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
        total: Number(cartItem.storeProduct.price) * newQuantity,
        totalAfterDiscount: hasDiscount
          ? Number(cartItem.storeProduct.priceAfterDiscount) * newQuantity
          : null,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Quantity updated successfully',
      data: updatedCartItem,
    });
  } catch (error) {
    console.error('Error updating quantity:', error);
    next(error);
  }
};

export const deleteCartItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { cartItemId } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!cartItemId) {
      res.status(400).json({ error: 'Cart item IDs are required' });
      return;
    }

    await prisma.cartItem.delete({
      where: {
        id: Number(cartItemId),
      },
    });

    res.status(200).json({ message: 'Delete cart item successfully' });
    return;
  } catch (error) {
    console.error('Error removing cart item:', error);
    next(error);
  }
};

export const getTotalAmountCart = async (
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

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    let totalWithoutDiscount = 0;
    let totalWithDiscount = 0;

    cart.cartItems.map((item) => {
      const price = Number(item.price);
      const priceAfterDiscount = item.priceAfterDiscount
        ? Number(item.priceAfterDiscount)
        : null;

      const quantity = item.quantity;

      if (priceAfterDiscount !== null && priceAfterDiscount > 0) {
        const totalAfterDisc = priceAfterDiscount * quantity;
        totalWithDiscount += totalAfterDisc;
      } else {
        const total = price * quantity;
        totalWithoutDiscount += total;
      }

      return item;
    });

    const finalTotal = totalWithoutDiscount + totalWithDiscount;

    res.status(200).json({
      ok: true,
      message: 'Total amount calculated successfully',
      data: finalTotal,
    });
  } catch (error) {
    console.error('Error calculating total amount:', error);
    next(error);
  }
};

export const getCart = async (
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

    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        CartValueCalculation: true,
        cartItems: {
          include: {
            storeProduct: {
              include: { product: { include: { ProductImages: true } } },
            },
          },
        },
      },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Cart retrieved successfully',
      data: cart,
    });
    return;
  } catch (error) {
    console.error('Error retrieving cart:', error);
    next(error);
  }
};

export const checkout = async (
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

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        cartItems: true,
      },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    let totalWithoutDiscount = 0;
    let totalWithDiscount = 0;

    cart.cartItems.map((item) => {
      const price = Number(item.price);
      const priceAfterDiscount = item.priceAfterDiscount
        ? Number(item.priceAfterDiscount)
        : null;

      const quantity = item.quantity;

      if (priceAfterDiscount !== null && priceAfterDiscount > 0) {
        const totalAfterDisc = priceAfterDiscount * quantity;
        totalWithDiscount += totalAfterDisc;
      } else {
        const total = price * quantity;
        totalWithoutDiscount += total;
      }

      return item;
    });

    const finalTotal = totalWithoutDiscount + totalWithDiscount;

    await prisma.cartValueCalculation.upsert({
      where: { cartId: cart.id },
      update: {
        totalAmountCart: finalTotal,
      },
      create: {
        cartId: cart.id,
        totalAmountCart: finalTotal,
      },
    });

    // ------------------------------------------------------------------------

    const finalData = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartValueCalculation: true,
        DiscountReport: true,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Checkout calculation successful',
      data: finalData,
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    return next(error);
  }
};
