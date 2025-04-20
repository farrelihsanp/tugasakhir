import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { loginSchema } from '../schemas/auth-schemas.js';
import { prisma } from '../configs/prisma.js';
import crypto from 'node:crypto';
import { Resend } from 'resend';
import fs from 'node:fs/promises';
import cloudinary from '../configs/cloudinary.js';
import { genSalt, hash } from 'bcryptjs';
import { UserData } from '../types/express.d.js';
import Handlebars from 'handlebars';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { emailOrUsername, password } = loginSchema.parse(req.body);

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });

    if (!existingUser) {
      res.status(400).json({ message: 'User not found! ' });
      return;
    }

    if (!existingUser.emailConfirmed) {
      res.status(400).json({ message: 'Please complete your registration! ' });
      return;
    }

    if (!existingUser.password) {
      res.status(400).json({ message: 'User password not found!' });
      return;
    }

    const isValidPassword = await compare(password, existingUser.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials!' });
      return;
    }

    const storeStoreAdmin = await prisma.storeUser.findFirst({
      where: {
        userId: existingUser.id,
      },
      select: {
        storeId: true,
      },
    });

    const jwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      username: existingUser.username,
      profileImage: existingUser.profileImage,
      email: existingUser.email,
      role: existingUser.role,
      storeId: storeStoreAdmin?.storeId,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '24h',
    });

    res
      .cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        domain:
          process.env.NODE_ENV === 'development' ? 'localhost' : 'quickmart',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      })
      .status(200)
      .json({
        ok: true,
        message: 'Login succeded!',
        role: existingUser.role,
        storeId: storeStoreAdmin?.storeId,
      });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    req.user = null;
    res
      .clearCookie('accessToken')
      .status(200)
      .json({ message: 'Logout succesfully!' });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUser(
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

    const user = await prisma.user.findFirst({
      where: { id: userId },
      include: { StoreUser: true },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export const sendEmailresetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    const confirmToken = crypto.randomBytes(20).toString('hex');
    const passwordResetLink = `http://localhost:8000/api/v1/confirm/reset-password?token=${confirmToken}`;

    await prisma.confirmToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
        token: confirmToken,
        userId: user.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/password-reset-template.hbs',
    );
    const compiledTemplate = Handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      name: user.name,
      passwordResetLink: passwordResetLink,
    });

    const { error } = await resend.emails.send({
      from: 'Password Reset <reset@resend.dev>',
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error });
      return;
    }

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    next(error);
  }
};

export const submitNewPassword = async (
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
    const { password } = req.body;

    if (!user.passwordConfirmed) {
      res.status(400).json({ error: 'you must confirm at your email' });
      return;
    }

    await prisma.user.update({
      where: { id: Number(user?.id) },
      data: { passwordConfirmed: false },
    });

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    await prisma.user.update({
      where: { id: Number(user?.id) },
      data: { password: hashedPassword },
    });

    await prisma.confirmToken.delete({
      where: { id: confirmTokenRecord.id },
    });

    res.status(200).json({ ok: true, message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { name, username, password, email } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  if (!name || !username || !password || !email) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  let profileImage;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        emailConfirmed: false,
      },
    });

    // Cek jika ada file foto yang diunggah
    if (req.file) {
      try {
        const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profileimage/images',
        });
        await fs.unlink(req.file.path);
        profileImage = cloudinaryData.secure_url; // Set foto baru
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({ error: 'Image upload failed' });
        return;
      }
    } else {
      profileImage = user.profileImage; // Gunakan foto lama jika tidak ada file baru
    }

    const data: UserData = {};

    if (name) data.name = name;
    if (username) data.username = username;
    if (profileImage) data.profileImage = profileImage;
    if (email) {
      data.email = email;
      const confirmToken = crypto.randomBytes(20).toString('hex');
      const confirmationLink = `http://localhost:8000/api/v1/confirm/update-email?token=${confirmToken}`;

      await prisma.confirmToken.create({
        data: {
          expiredDate: new Date(Date.now() + 1000 * 60 * 5),
          token: confirmToken,
          userId: Number(userId),
        },
      });

      const templateSource = await fs.readFile(
        'src/templates/update-email-confirmation-template.hbs',
      );
      const compiledTemplate = Handlebars.compile(templateSource.toString());
      const htmlTemplate = compiledTemplate({
        name: name || user.name,
        confirmationLink: confirmationLink,
      });

      const { error } = await resend.emails.send({
        from: 'Update email <onboarding@resend.dev>',
        to: email,
        subject: 'Update Confirmation Email',
        html: htmlTemplate,
      });

      if (error) {
        res.status(400).json({ error: 'Email update failed' });
        return;
      }
    }

    if (password) {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      data.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: data,
    });

    res
      .status(200)
      .json({ message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    next(error);
  }
};
