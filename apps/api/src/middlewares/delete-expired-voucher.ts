import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export default async function deleteExpiredVoucher(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const allUserVouchers = await prisma.voucher.findMany({
      where: {
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
        isActive: true,
        endDate: { gt: new Date() },
      },
    });

    const expiredVouchers = await prisma.voucher.findMany({
      where: {
        VoucherUser: {
          some: {
            userId: userId,
          },
        },
        isActive: true,
        endDate: { lte: new Date() },
      },
    });

    if (expiredVouchers && expiredVouchers.length > 0) {
      await prisma.voucher.updateMany({
        where: { id: { in: expiredVouchers.map((voucher) => voucher.id) } },
        data: { isActive: false },
      });
    }

    await prisma.voucher.deleteMany({
      where: {
        id: { in: expiredVouchers.map((voucher) => voucher.id) },
        isActive: false,
      },
    });

    if (!allUserVouchers || allUserVouchers.length === 0) {
      res.status(404).json({ error: 'Voucher not found' });
      return;
    }

    res.status(200).json({ ok: true, message: 'Voucher deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
