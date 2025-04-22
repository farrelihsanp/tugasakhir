import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { typeOfChange, Role } from '@prisma/client';

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, excerpt, description, categoryIds, weight } = req.body;

    if (!name || !excerpt || !description || !categoryIds || !weight) {
      res.status(400).json({ error: 'All required fields must be filled' });
      return;
    }

    const existingProduct = await prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (existingProduct) {
      res.status(400).json({ error: 'Product name already exists' });
      return;
    }

    await prisma.product
      .findFirst({
        where: { name },
      })
      .then((product) => {
        if (product) {
          res.status(400).json({ error: 'Product name already exists' });
          return;
        }
      });

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      res.status(400).json({ error: 'categoryIds must be a non-empty array' });
      return;
    }

    const validCategoryIds = await prisma.category.findMany({
      select: { id: true },
    });

    const validCategorySet = new Set(validCategoryIds.map((cat) => cat.id));
    const invalidIds = categoryIds.filter(
      (id: number) => !validCategorySet.has(Number(id)),
    );

    if (invalidIds.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid categoryIds: ${invalidIds.join(', ')}` });
      return;
    }

    const productImages = [];
    const failedUploads = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: 'product_images',
            timeout: 120000,
          });
          productImages.push({ imageUrl: upload.secure_url });
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          failedUploads.push(file.path);
        }
      }
    }

    if (failedUploads.length > 0) {
      res.status(500).json({
        error: `Failed to upload ${failedUploads.length} images`,
        failedUploads,
      });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct = await prisma.product.create({
      data: {
        name,
        excerpt,
        description,
        slug,
        weight: parseFloat(weight),
        CategoryProduct: {
          create: categoryIds.map((id: number) => ({ categoryId: Number(id) })),
        },
        ProductImages: {
          create: productImages,
        },
      },
    });

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error('File cleanup error:', err);
        }
      }
    }

    res.status(201).json({
      ok: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductGlobal = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { productId, name, excerpt, description, price, categoryId, weight } =
      req.body;

    if (
      !productId ||
      !name ||
      !excerpt ||
      !description ||
      !price ||
      !categoryId ||
      !weight
    ) {
      res.status(400).json({ error: 'All required fields must be filled' });
      return;
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: { ProductImages: true },
    });

    if (!existingProduct) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const duplicateName = await prisma.product.findFirst({
      where: {
        name,
        NOT: { id: Number(productId) },
      },
    });

    if (duplicateName) {
      res
        .status(400)
        .json({ error: 'Another product with this name already exists' });
      return;
    }

    if (!Array.isArray(categoryId) || categoryId.length === 0) {
      res.status(400).json({ error: 'categoryIds must be a non-empty array' });
      return;
    }

    const validCategoryIds = await prisma.category.findMany({
      select: { id: true },
    });

    const validCategorySet = new Set(validCategoryIds.map((cat) => cat.id));
    const invalidIds = categoryId.filter(
      (id: number) => !validCategorySet.has(Number(id)),
    );

    if (invalidIds.length > 0) {
      res
        .status(400)
        .json({ error: `Invalid categoryIds: ${invalidIds.join(', ')}` });
      return;
    }

    const productImages = [];
    const failedUploads = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          const upload = await cloudinary.uploader.upload(file.path, {
            folder: 'product_images',
            timeout: 120000,
          });
          productImages.push({ imageUrl: upload.secure_url });
        } catch (err) {
          console.error('Cloudinary upload error:', err);
          failedUploads.push(file.path);
        }
      }
    }

    if (failedUploads.length > 0) {
      res.status(500).json({
        error: `Failed to upload ${failedUploads.length} images`,
        failedUploads,
      });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await prisma.categoryProduct.deleteMany({
      where: { productId: Number(productId) },
    });

    await prisma.productImage.deleteMany({
      where: { productId: Number(productId) },
    });

    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        name,
        excerpt,
        description,
        slug,
        weight: parseFloat(weight),
        CategoryProduct: {
          create: categoryId.map((id: number) => ({ categoryId: Number(id) })),
        },
        ProductImages: {
          create: productImages,
        },
      },
    });

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        try {
          await fs.unlink(file.path);
        } catch (err) {
          console.error('File cleanup error:', err);
        }
      }
    }

    res.status(200).json({
      ok: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductInSomeStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeSlug } = req.params;
  const { editStock, price, productId } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const store = await prisma.store.findFirst({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) {
    res.status(404).json({ error: 'Store not found' });
    return;
  }

  try {
    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        storeId: store.id,
        productId: Number(productId),
      },
    });

    if (!storeProduct) {
      res
        .status(404)
        .json({ error: 'Product not found in the specified store' });
      return;
    }

    if (price <= 50000) {
      await prisma.storeProduct.update({
        where: {
          id: storeProduct.id,
        },
        data: {
          isCheap: true,
        },
      });
    }

    await prisma.storeProduct.update({
      where: {
        id: storeProduct.id,
      },
      data: {
        stock: editStock ?? storeProduct.stock,
        price: parseFloat(price),
      },
    });

    if (editStock > storeProduct.stock) {
      await prisma.productChangeData.create({
        data: {
          productId: Number(productId),
          userId,
          orderId: null,
          stock: editStock,
          lastStock: storeProduct.stock,
          difference: editStock - storeProduct.stock,
          finalStock: editStock,
          typeOfChange: typeOfChange.PENAMBAHAN,
          role: Role.SUPERADMIN,
          storeId: store.id,
        },
      });
    } else if (editStock < storeProduct.stock) {
      await prisma.productChangeData.create({
        data: {
          productId: Number(productId),
          userId,
          orderId: null,
          stock: editStock,
          lastStock: storeProduct.stock,
          difference: storeProduct.stock - editStock,
          finalStock: editStock,
          typeOfChange: typeOfChange.PENGURANGAN,
          role: Role.SUPERADMIN,
          storeId: store.id,
        },
      });
    }

    res.status(200).json({
      ok: true,
      message: 'Product updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { productId } = req.body;

  try {
    await prisma.product.delete({
      where: {
        id: Number(productId),
      },
    });
    res.status(204).json({ ok: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProducts = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        ProductImages: true,
        CategoryProduct: {
          include: { Category: true },
        },
      },
    });
    res
      .status(200)
      .json({ ok: true, message: 'Products found', data: products });
  } catch (error) {
    next(error);
  }
};

// Get a product by ID
export const getDetailProductBySlugByStoreSlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeSlug, productSlug } = req.params;

  try {
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const productId = await prisma.product.findFirst({
      where: {
        slug: productSlug,
      },
    });

    if (!productId) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        storeId: store.id,
        productId: productId.id,
      },
      include: {
        product: {
          include: {
            ProductImages: true,
            CategoryProduct: {
              include: { Category: true },
            },
          },
        },
      },
    });

    if (!storeProduct) {
      res
        .status(404)
        .json({ error: 'Product not found in the specified store' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Product retrieved successfully',
      data: storeProduct,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProductsByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.params;

  try {
    const storeProducts = await prisma.product.findMany({
      where: {
        storeProducts: {
          some: {
            storeId: Number(storeId),
          },
        },
      },
      include: {
        ProductImages: true,
        CategoryProduct: {
          include: { Category: true },
        },
        storeProducts: true,
      },
    });

    if (storeProducts.length === 0) {
      res.status(404).json({ error: 'No products found for this store' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Products retrieved successfully',
      data: storeProducts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProductsByStoreSlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeSlug } = req.params;

  try {
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const storeProducts = await prisma.product.findMany({
      where: {
        storeProducts: {
          some: {
            storeId: store.id,
          },
        },
      },
      include: {
        ProductImages: true,
        CategoryProduct: {
          include: { Category: true },
        },
        storeProducts: true,
      },
    });

    if (storeProducts.length === 0) {
      res.status(404).json({ error: 'No products found for this store' });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Products retrieved successfully',
      data: storeProducts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getAllProductsByCategoryByStoreSlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeSlug, categorySlug } = req.params;

  try {
    const store = await prisma.store.findFirst({
      where: {
        slug: storeSlug,
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    const products = await prisma.storeProduct.findMany({
      where: {
        storeId: store.id,
        product: {
          CategoryProduct: {
            some: {
              Category: {
                slug: categorySlug,
              },
            },
          },
        },
      },
      include: {
        product: {
          include: {
            ProductImages: true,
            CategoryProduct: {
              include: { Category: true },
            },
          },
        },
      },
    });

    if (products.length === 0) {
      res.status(404).json({
        error: 'No products found for this store and category',
      });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Products retrieved successfully',
      data: products,
      store: store,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getCheapProductsByStoreId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeId } = req.params;

  try {
    const cheapProducts = await prisma.storeProduct.findMany({
      where: {
        storeId: Number(storeId),
        isCheap: true,
      },
      include: {
        product: {
          include: {
            CategoryProduct: {
              include: { Category: true },
            },
            ProductImages: true,
          },
        },
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Cheap products retrieved successfully',
      data: cheapProducts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getFilteredProductChanges = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month, year, category, product } = req.query;

    if (!month || !year) {
      res.status(400).json({ error: 'Month and year are required' });
      return;
    }

    const monthNum = Number(month);
    const yearNum = Number(year);

    const startDate = new Date(`${yearNum}-${monthNum}-01`);
    const endDate = new Date(`${yearNum}-${monthNum + 1}-01`);

    const productChanges = await prisma.productChangeData.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
        product: {
          name: product
            ? {
                contains: product as string,
                mode: 'insensitive',
              }
            : undefined,
          CategoryProduct: category
            ? {
                some: {
                  Category: {
                    name: {
                      contains: category as string,
                      mode: 'insensitive',
                    },
                  },
                },
              }
            : undefined,
        },
      },
      include: {
        product: {
          include: {
            CategoryProduct: {
              include: {
                Category: true,
              },
            },
          },
        },
        User: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({ data: productChanges });
  } catch (error) {
    console.error('Error filtering product changes:', error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                     CONTOH FILTER QUERY PADA FRONT END                     */
/* -------------------------------------------------------------------------- */

// GET /api/product-change-data?month=1&year=2025&category=Buah&product=Apel

export const getMonthlyProductSummary = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { month, year, category } = req.query;

    if (!month || !year) {
      res.status(400).json({ error: 'Month and year are required' });
      return;
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(`${year}-${Number(month) + 1}-01`);

    // Ambil semua produk dalam kategori tersebut
    const products = await prisma.product.findMany({
      where: {
        CategoryProduct: category
          ? {
              some: {
                Category: {
                  name: {
                    contains: category as string,
                    mode: 'insensitive',
                  },
                },
              },
            }
          : undefined,
      },
      include: {
        ProductChangeData: {
          where: {
            createdAt: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
        ProductImages: true,
        storeProducts: true,
      },
    });

    const summary = products.map((product) => {
      const penambahan = product.ProductChangeData.filter(
        (d) => d.typeOfChange === 'PENAMBAHAN',
      ).reduce((acc, d) => acc + d.stock, 0);

      const pembelian = product.ProductChangeData.filter(
        (d) => d.typeOfChange === 'PEMBELIAN',
      ).reduce((acc, d) => acc + d.stock, 0);

      const latestStockChange = product.ProductChangeData.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      )[0];

      const stock = latestStockChange?.lastStock ?? 0;

      return {
        id: product.id,
        name: product.name,
        price: product.storeProducts[0]?.price ?? 0,
        penambahan,
        pembelian,
        stock,
        image: product.ProductImages[0]?.imageUrl ?? '',
      };
    });

    res.status(200).json({ data: summary });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

/* -------------------------------------------------------------------------- */
/*                           CONTOH QUERY FRONT END                           */
/* -------------------------------------------------------------------------- */

// GET /api/monthly-product-summary?month=1&year=2025&category=Buah
