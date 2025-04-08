import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import path from 'node:path';
import fs from 'node:fs';
import cloudinary from '../configs/cloudinary.js';
import slugifyModule from 'slugify';
const slugify = slugifyModule.default;

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, excerpt, description } = req.body;
    const image = req.file;

    if (!name || !excerpt || !description || !image) {
      res
        .status(400)
        .json({ message: 'Semua field wajib diisi, termasuk gambar.' });
      return;
    }

    const filePath = path.resolve(image.path);

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'categories',
    });

    fs.unlinkSync(filePath);

    const category = await prisma.category.create({
      data: {
        name,
        excerpt,
        description,
        slug: slugify(name, { lower: true }),
        image: result.secure_url,
      },
    });

    res
      .status(201)
      .json({ ok: true, message: 'Kategori berhasil dibuat.', category });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).json({
      ok: true,
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  const { name, excerpt, description } = req.body;
  const image = req.file;

  try {
    // Find the current category to check if there is an existing image
    const currentCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!currentCategory) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    let imageUrl = currentCategory.image;

    // If a new image is provided, upload it to Cloudinary and delete the old one
    if (image) {
      const filePath = path.resolve(image.path);

      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'categories',
      });

      // Delete the old image from Cloudinary if it exists
      if (currentCategory.image) {
        const publicId = currentCategory.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }

      // Remove the uploaded file from the local server
      fs.unlinkSync(filePath);

      imageUrl = result.secure_url;
    }

    // Update the category with the new data, including the image URL if it's updated
    const category = await prisma.category.update({
      where: { id: Number(id) },
      data: {
        name,
        excerpt,
        description,
        slug: slugify(name, { lower: true }),
        image: imageUrl,
      },
    });

    res
      .status(200)
      .json({ message: 'Category updated successfully', category });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
