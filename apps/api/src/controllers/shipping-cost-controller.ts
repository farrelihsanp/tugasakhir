import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export const calculateShippingCost = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const cartUser = await prisma.cart.findFirst({
    where: {
      userId: userId,
    },
    include: {
      cartItems: {
        include: {
          Product: true,
        },
      },
    },
  });

  if (!cartUser) {
    res.status(404).json({ error: 'Cart not found' });
    return;
  }

  const totalWeight = cartUser.cartItems.reduce(
    (total, item) => total + (item.Product?.weight || 0) * item.quantity,
    0,
  );

  if (totalWeight === 0) {
    res
      .status(400)
      .json({ error: 'Cart is empty or all items have zero weight' });
    return;
  }

  /* -------------------------------------------------------------------------- */
  /*                        CARI DESTINATION ALAMAT USER                        */
  /* -------------------------------------------------------------------------- */

  const destinationAddress = await prisma.address.findFirst({
    where: {
      userId: userId,
      isPrimary: true,
    },
    select: {
      postalCode: true,
      isActive: true,
    },
  });

  if (!destinationAddress || !destinationAddress.postalCode) {
    res.status(400).json({ error: 'Destination postal code is required' });
    return;
  }

  /* -------------------------------------------------------------------------- */
  /*                        CARI ORIGIN POSTAL CODE STORE                       */
  /* -------------------------------------------------------------------------- */

  const { storeSlug } = req.params;

  const postalCodeStore = await prisma.store.findFirst({
    where: {
      slug: storeSlug,
    },
    select: {
      postalCode: true,
    },
  });

  if (!postalCodeStore || !postalCodeStore.postalCode) {
    res.status(400).json({ error: 'Origin postal code is required' });
    return;
  }

  const courier =
    'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse';

  const apiKey = process.env.RAJA_ONGKIR_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'API key is not configured' });
    return;
  }

  try {
    const response = await fetch(
      'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost',
      {
        method: 'POST',
        headers: {
          key: apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          origin: postalCodeStore.postalCode.toString(),
          destination: destinationAddress.postalCode.toString(),
          weight: totalWeight.toString(),
          courier: courier,
          price: 'lowest',
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to fetch shipping cost: ${errorData.message || response.statusText}`,
      );
    }

    const data = await response.json();
    if (!data || !data.rajaongkir || !data.rajaongkir.results) {
      res.status(500).json({ error: 'Invalid response from shipping API' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Shipping cost calculated successfully',
      data: data,
    });
  } catch (error) {
    next(error);
  }
};
