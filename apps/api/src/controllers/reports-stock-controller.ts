import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export async function getStockReportStore(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { storeSlug } = req.params;

    const store = await prisma.store.findFirst({
      where: { slug: storeSlug },
    });

    const stockDataStore = await prisma.productChangeData.findMany({
      where: {
        storeId: store?.id,
      },
    });

    res
      .status(200)
      .json({ ok: true, message: 'Stock report found', data: stockDataStore });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
