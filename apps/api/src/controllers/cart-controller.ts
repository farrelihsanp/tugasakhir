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

    let cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        storeProductId: storeProduct.id,
      },
    });

    const totalPrice = Number(storeProduct.price) * quantity;

    if (cartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity: cartItem.quantity + quantity,
          total: cartItem.total + totalPrice,
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
          price: storeProduct.price,
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

    if (cartItem.storeProduct.stock < quantity + cartItem.quantity) {
      res.status(400).json({ error: 'Not enough stock available' });
      return;
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: { increment: quantity },
        total:
          Number(cartItem.storeProduct.price) * (cartItem.quantity + quantity),
      },
    });

    res.status(200).json({ message: 'Update quantity successfully' });
    return;
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
    if (newQuantity < 0) {
      res.status(400).json({ error: 'Quantity cannot be negative' });
      return;
    }
    if (newQuantity === 0) {
      res.status(400).json({ error: 'Cannot decrease to 0' });
      return;
    }

    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
        total: Number(cartItem.storeProduct.price) * newQuantity,
      },
    });

    res.status(200).json({ message: 'Update quantity successfully' });
    return;
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
      where: { userId: userId },
      include: { cartItems: true },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const totalAmount = cart.cartItems.reduce(
      (total, item) => total + item.total,
      0,
    );

    res.status(200).json({
      ok: true,
      message: 'Total amount retrieved successfully',
      data: { totalAmount },
    });
    return;
  } catch (error) {
    console.error('Error retrieving total amount:', error);
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
      where: { userId: userId },
      include: { cartItems: true },
    });

    if (!cart) {
      res.status(404).json({ error: 'Cart not found' });
      return;
    }

    const totalAmount = cart.cartItems.reduce(
      (total, item) => total + item.total,
      0,
    );

    await prisma.cartValueCalculation.upsert({
      where: { cartId: cart.id },
      create: {
        cart: { connect: { id: cart.id } },
        totalAmountCart: totalAmount,
      },
      update: { totalAmountCart: totalAmount },
    });

    const finalData = await prisma.cart.findUnique({
      where: { userId: userId },
      include: {
        CartValueCalculation: true,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Total amount retrieved successfully',
      data: finalData,
    });
    return;
  } catch (error) {
    console.error('Error retrieving total amount:', error);
    next(error);
  }
};
