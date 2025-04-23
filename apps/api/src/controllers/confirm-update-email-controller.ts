import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = new Resend(process.env.RESEND_API_KEY_KAYLA);

export async function confirmUpdateEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.query.token;

    if (!token) {
      res.status(400).json({ message: 'Token is required!' });
      return;
    }

    const tokenRecord = await prisma.confirmToken.findFirst({
      where: { token: token.toString() },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    await prisma.confirmToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { emailConfirmed: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.userId },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const templateSource = await fs.readFile(
      'src/templates/email-update-success-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());

    const htmlTemplate = compiledTemplate({
      name: user.name,
      confirmationLink: `${process.env.WEB_DOMAIN}/auth/login`,
    });

    // Send the email via Resend
    const { error } = await resend.emails.send({
      from: 'Email Updated <update@resend.dev>',
      to: user.email,
      subject: 'Email Updated Successfully',
      html: htmlTemplate,
    });

    if (error) {
      res.status(500).json({ error: 'Failed to send confirmation email' });
      return;
    }

    res.status(200).send(htmlTemplate);
  } catch (error) {
    next(error);
  }
}

export async function checkUpdateEmailStatus(
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
