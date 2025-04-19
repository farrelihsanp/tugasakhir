import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { genSalt, hash } from 'bcryptjs';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';

import { Role } from '@prisma/client';
import { StoreAdminSchema } from '../schemas/auth-schemas.js';

// Create Admin
export const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, username, storeId } = req.body;

    if (!name || !email || !password || !username || !storeId) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    // Validasi storeId
    const storeExists = await prisma.store.findUnique({
      where: { id: +storeId },
    });

    if (!storeExists) {
      res.status(404).json({ message: 'Store not found!' });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743609225/DEFAULT-PP_p5kx9w.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profileimage/images',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl };
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl };
    }

    const referralNumber = `REF${Date.now().toString().slice(-3)}`;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newAdmin = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: Role.STOREADMIN,
        username: username,
        referralNumber: referralNumber,
        referralCount: 0,
        profileImage: cloudinaryData.secure_url,
        provider: 'CREDENTIALS',
      },
    });

    await prisma.storeUser.create({
      data: {
        userId: newAdmin.id,
        storeId: +storeId,
      },
    });

    res.status(201).json({ ok: true, data: newAdmin });
  } catch (error) {
    next(error);
  }
};

// Update Admin
export const updateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, password, username, storeId } = StoreAdminSchema.parse(
      req.body,
    );

    if (!name || !email || !password || !username || !storeId) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    let cloudinaryData;
    const defaultImageUrl =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1743609225/DEFAULT-PP_p5kx9w.jpg';

    if (req.file) {
      try {
        cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profileimage/images',
        });
        await fs.unlink(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        cloudinaryData = { secure_url: defaultImageUrl };
      }
    } else {
      cloudinaryData = { secure_url: defaultImageUrl };
    }

    const adminId = req.params?.id;

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const updatedAdmin = await prisma.user.update({
      where: { id: +adminId },
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        username: username,
        profileImage: cloudinaryData.secure_url,
        role: Role.STOREADMIN,
      },
    });

    const storeUserId = await prisma.storeUser.findFirst({
      where: { userId: +adminId },
    });

    if (storeUserId) {
      await prisma.storeUser.update({
        where: { id: storeUserId.id },
        data: { storeId: +storeId },
      });
    }
    res.status(200).json({ ok: true, data: updatedAdmin });
  } catch (error) {
    next(error);
  }
};

// Delete Admin
export const deleteAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Delete admin
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// Get All Admins
export const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const admins = await prisma.user.findMany({
      where: { role: 'STOREADMIN' },
      include: {
        StoreUser: { include: { store: true } },
      },
    });

    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const adminId = parseInt(id, 10);
    if (isNaN(adminId) || adminId <= 0) {
      res
        .status(400)
        .json({ error: 'Invalid ID. ID must be a positive integer.' });
      return;
    }

    const admin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      res.status(404).json({ error: 'Admin not found.' });
      return;
    }

    res.status(200).json({ ok: true, message: 'Admin found', data: admin });
  } catch (error) {
    next(error);
  }
};

export const assignStoreAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId, storeId } = req.body;

    if (!userId || !storeId) {
      res.status(400).json({ message: 'User ID and Store ID are required!' });
      return;
    }

    const storeExists = await prisma.store.findUnique({
      where: { id: Number(storeId) },
    });

    if (!storeExists) {
      res.status(404).json({ message: 'Store not found!' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found!' });
      return;
    }

    if (!Role.SUPERADMIN) {
      res.status(400).json({
        message: 'User must be a superadmin to be assigned as store admin.',
      });
      return;
    }

    // Check if the store already has a store admin
    const existingStoreAdmin = await prisma.storeUser.findFirst({
      where: {
        storeId: Number(storeId),
        user: {
          role: Role.STOREADMIN,
        },
      },
    });

    if (existingStoreAdmin) {
      res.status(400).json({
        message: 'This store already has a store admin!',
      });
      return;
    }

    // Update user role to STOREADMIN
    await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        role: Role.STOREADMIN,
      },
    });

    // Assign the user as store admin
    await prisma.storeUser.create({
      data: {
        userId: Number(userId),
        storeId: Number(storeId),
      },
    });

    res.status(200).json({
      message: 'User successfully assigned as store admin!',
      userId,
      storeId,
    });
  } catch (error) {
    next(error);
  }
};
