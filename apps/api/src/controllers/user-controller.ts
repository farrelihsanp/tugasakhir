import { Request, Response, NextFunction } from 'express';
import { prisma } from '../configs/prisma.js';
import { Role } from '@prisma/client';
import { Provider } from '@prisma/client';

export const getAllCustomers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: Role.CUSTOMERS },
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ ok: true, message: 'Users found', data: users });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const lookupUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ ok: false, message: 'User not found' });
      return;
    }

    res.status(200).json({ ok: true, message: 'User found', data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, username, email, profileImage } = req.body;
  try {
    if (!name || !username || !email || !profileImage) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    const referralCode = `REF${Date.now().toString().slice(-5)}`;

    const user = await prisma.user.create({
      data: {
        name,
        username,
        profileImage,
        email,
        emailConfirmed: true,
        passwordConfirmed: true,
        role: Role.CUSTOMERS,
        provider: Provider.GOOGLE,
        referralNumber: referralCode,
      },
    });
    res.status(200).json({ ok: true, message: 'User created', data: user });
  } catch (error) {
    next(error);
  }
};
