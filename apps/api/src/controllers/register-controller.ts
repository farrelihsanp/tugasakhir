import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import Handlebars from 'handlebars';
import fs from 'node:fs/promises';
import { Resend } from 'resend';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import { genSalt, hash } from 'bcryptjs';
import { Provider } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = new Resend(process.env.RESEND_API_KEY_KAYLA);

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { emailInput } = req.body;

    if (!emailInput) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: emailInput },
    });

    if (existingUser) {
      res
        .status(400)
        .json({ message: 'Email or username has already been used' });
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        name: '',
        username: '',
        email: emailInput,
        role: 'UNSET',
        password: '',
        referralNumber: '',
        profileImage: '',
        provider: 'CREDENTIALS',
      },
    });

    const confirmToken = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `${process.env.API_DOMAIN}/api/v1/confirm/email?token=${confirmToken}`;

    await prisma.confirmToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 5),
        token: confirmToken,
        userId: newUser.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/email-confirmation-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      email: emailInput,
      confirmationLink: confirmationLink,
    });

    const { error } = await resend.emails.send({
      from: 'User Confirmation <onboarding@quickmart.click>',
      to: emailInput,
      subject: 'Confirmation Email',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    res.status(200).json({ ok: true, message: 'Register completed!' });
  } catch (error) {
    next(error);
  }
}

export async function completeRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, name, username, password, reTypePassword, role } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required!' });
      return;
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      res.status(400).json({ message: 'User not found!' });
      return;
    }

    if (!name || !username || !password || !reTypePassword || !role || !email) {
      res.status(400).json({ message: 'All fields are required!' });
      return;
    }

    if (user.emailConfirmed === false) {
      res.status(400).json({ message: 'Please complete your registration!' });
      return;
    }

    if (password !== reTypePassword) {
      res
        .status(400)
        .json({ message: 'Password and retype password are not the same' });
      return;
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    let cloudinaryData;
    const defaultImageUrl =
      'https://dummyimage.com/600x400/90ee90/fff&text=dummy-user-profile';

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

    const referralCode = `REF${Date.now().toString().slice(-5)}`;

    const finalUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        username,
        password: hashedPassword,
        referralNumber: referralCode,
        role,
        profileImage: cloudinaryData.secure_url,
        emailConfirmed: true,
        provider: Provider.CREDENTIALS,
      },
    });

    res
      .status(200)
      .json({ ok: true, message: 'Registration completed!', data: finalUser });
  } catch (error) {
    next(error);
  }
}
