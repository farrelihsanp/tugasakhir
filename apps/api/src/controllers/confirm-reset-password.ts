import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';

export const confirmPasswordReset = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const querytoken = req.query.token;

    if (!querytoken) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const confirmTokenRecord = await prisma.confirmToken.findFirst({
      where: { token: querytoken.toString() },
      include: { user: true },
    });

    if (!confirmTokenRecord || confirmTokenRecord.expiredDate < new Date()) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    const user = confirmTokenRecord.user;

    if (!user) {
      res.status(400).json({ message: 'User not found!' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordConfirmed: true },
    });

    const templateSource = await fs.readFile(
      'src/templates/password-reset-success-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      nextLink: `${process.env.WEB_DOMAIN}/recovery-password?token=${querytoken}`,
    });

    res.status(200).send(htmlTemplate);
  } catch (error) {
    next(error);
  }
};
