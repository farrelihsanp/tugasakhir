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
    const storeId = req.params.id;

    if (!storeId) {
      res.status(400).json({ error: 'Store ID is required' });
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

    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        productId: Number(productId),
        storeId: Number(storeId),
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

    const cart = await prisma.cart.upsert({
      where: { userId: userId },
      update: {},
      create: { userId: userId },
    });

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

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: { increment: quantity },
        total:
          Number(cartItem.storeProduct.price) * (cartItem.quantity + quantity),
      },
    });

    res
      .status(200)
      .json({ message: 'Update quantity successfully', data: updated });
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

    const updated = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
        total: Number(cartItem.storeProduct.price) * newQuantity,
      },
    });

    res
      .status(200)
      .json({ message: 'Update quantity successfully', data: updated });
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
    const { cartItemIds } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!cartItemIds) {
      res.status(400).json({ error: 'Cart item IDs are required' });
      return;
    }

    await prisma.cartItem.deleteMany({ where: { id: { in: cartItemIds } } });
    res.status(200).json({ message: 'Delete cart item successfully' });
    return;
  } catch (error) {
    console.error('Error removing cart item:', error);
    next(error);
  }
};

export const getAllAddressesUser = async (
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

    const addresses = await prisma.address.findMany({
      where: { userId: Number(userId) },
    });

    res.status(200).json({
      ok: true,
      message: 'Addresses retrieved successfully',
      data: addresses,
    });
    return;
  } catch (error) {
    console.error('Error retrieving addresses:', error);
    next(error);
  }
};

export const setShippingAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { addressIds } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    if (!addressIds) {
      res.status(400).json({ error: 'Address ID is required' });
      return;
    }

    await prisma.address.updateMany({
      where: { userId: userId, isActive: true },
      data: { isActive: false },
    });

    await prisma.address.update({
      where: { id: Number(addressIds), userId: userId },
      data: { isActive: true },
    });

    res.status(200).json({ message: 'Set shipping address successfully' });
    return;
  } catch (error) {
    console.error('Error setting shipping address:', error);
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
