import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';

export async function confirmEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const tokenQuery = req.query.token;

    if (!tokenQuery) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const tokenRecord = await prisma.confirmToken.findFirst({
      where: { token: tokenQuery.toString() },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailConfirmed: true },
    });

    const userEmail = await prisma.user.findUnique({
      where: { id: tokenRecord.userId },
      select: { email: true },
    });

    const templateSource = await fs.readFile(
      'src/templates/fill-data-confirmation-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      email: userEmail?.email,
      confirmationLink: `${process.env.WEB_DOMAIN}/fill-data-registration?email=${userEmail?.email}`,
    });

    res.status(200).send(htmlTemplate);
  } catch (error) {
    next(error);
  }
}

export async function checkEmailStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId, emailConfirmed: true },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ emailConfirmed: user.emailConfirmed });
  } catch (error) {
    next(error);
  }
}
