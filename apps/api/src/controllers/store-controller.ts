import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'node:fs/promises';
import { getDistance } from 'geolib';
import { convertAddressToCoordinates } from '../utils/geocode.js';

export const createStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Destructure request body for clarity
    const {
      name,
      address,
      city,
      province,
      country,
      postalCode,
      phoneNumber,
      maxServiceDistance,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !address ||
      !city ||
      !province ||
      !country ||
      !postalCode ||
      !phoneNumber ||
      !maxServiceDistance
    ) {
      res.status(400).json({
        error: 'All fields are required, including maxServiceDistance',
      });
      return;
    }

    // Custom slug generation function
    const createSlug = (input: string): string => {
      return input
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
    };

    const slug = createSlug(name);

    // Default image URL
    let storeImage =
      'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

    // Handle image upload if a file is provided
    if (req.file) {
      try {
        const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'store/images',
        });
        storeImage = cloudinaryData.secure_url;
        await fs.unlink(req.file.path); // Remove the file from the server after uploading
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    // Get coordinates from address
    const coordinates = await convertAddressToCoordinates(
      `${address}, ${city}, ${postalCode}, ${country}`,
    );
    const latitude = coordinates?.results[0]?.geometry?.lat ?? 0;
    const longitude = coordinates?.results[0]?.geometry?.lng ?? 0;

    // Create new store entry in the database
    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        city,
        province,
        country,
        postalCode,
        phoneNumber,
        latitude,
        longitude,
        maxServiceDistance: +maxServiceDistance * 1000,
        slug,
        storeImage,
      },
    });

    // Respond with the newly created store
    res.status(201).json({
      ok: true,
      message: 'Store created successfully',
      data: newStore,
    });
  } catch (error) {
    console.error('Error creating store:', error);
    next(error);
  }
};

export const updateStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Destructure request body and params for clarity
    const {
      name,
      address,
      city,
      province,
      country,
      postalCode,
      phoneNumber,
      maxServiceDistance,
    } = req.body;

    // Get the store ID from request parameters
    const { id } = req.params;

    // Validate required fields
    if (
      !id || // Ensure id is provided
      !name ||
      !address ||
      !city ||
      !province ||
      !country ||
      !postalCode ||
      !phoneNumber ||
      !maxServiceDistance
    ) {
      res.status(400).json({
        error: 'All fields are required, including id and maxServiceDistance',
      });
      return;
    }

    // Custom slug generation function
    const createSlug = (input: string): string => {
      return input
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
    };

    const slug = createSlug(name);

    // Default image URL
    let storeImage = undefined; // Initialize as undefined to handle no image case

    // Handle image upload if a file is provided
    if (req.file) {
      try {
        const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
          folder: 'store/images',
        });
        storeImage = cloudinaryData.secure_url;
        await fs.unlink(req.file.path); // Remove the file from the server after uploading
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        res.status(500).json({ error: 'Failed to upload image' });
        return;
      }
    }

    // Get coordinates from address
    const coordinates = await convertAddressToCoordinates(
      `${address}, ${city}, ${postalCode}, ${country}`,
    );
    const latitude = coordinates?.results[0]?.geometry?.lat ?? 0;
    const longitude = coordinates?.results[0]?.geometry?.lng ?? 0;

    // Fetch the store to update
    const storeToUpdate = await prisma.store.findUnique({
      where: { id: +id },
    });

    if (!storeToUpdate) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }

    // Update store entry in the database
    const updatedStore = await prisma.store.update({
      where: { id: +id },
      data: {
        name,
        address,
        city,
        province,
        country,
        postalCode,
        phoneNumber,
        latitude,
        longitude,
        maxServiceDistance: +maxServiceDistance * 1000,
        slug,
        storeImage:
          storeImage !== undefined ? storeImage : storeToUpdate.storeImage, // Use existing image if no new image is provided
      },
    });

    // Respond with the updated store
    res.status(200).json({
      ok: true,
      message: 'Store updated successfully',
      data: updatedStore,
    });
  } catch (error) {
    console.error('Error updating store:', error);
    next(error);
  }
};

// Delete a store
export const deleteStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    await prisma.store.delete({
      where: { id: Number(id) },
    });
    res.status(204).json({ message: 'Store deleted successfully' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get a store by ID
export const getStoreById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;

  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(id) },
    });
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.status(200).json({ ok: true, data: store });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getStoreBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { storeSlug } = req.params;

  try {
    const store = await prisma.store.findFirst({
      where: { slug: storeSlug },
    });
    if (!store) {
      res.status(404).json({ error: 'Store not found' });
      return;
    }
    res.status(200).json({ ok: true, message: 'Store found', data: store });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// Get all stores
export const getAllStores = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stores = await prisma.store.findMany();
    res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getNearestStore = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { latitudeUser, longitudeUser } = req.query;

  try {
    const allStores = await prisma.store.findMany({
      where: {
        isActive: true,
      },
    });

    if (!allStores || allStores.length === 0) {
      res.status(404).json({ message: 'No active stores found.' });
      return;
    }

    // Jika tidak ada koordinat dari user (tidak memberi izin lokasi)
    if (!latitudeUser || !longitudeUser) {
      const primaryStore = allStores.find((store) => store.isPrimary);
      if (primaryStore) {
        res.status(200).json({
          ok: true,
          message: 'No location provided, returning primary store',
          data: primaryStore,
        });
      } else {
        res.status(404).json({ message: 'Primary store not found.' });
        return;
      }
    }

    const userLat = Number(latitudeUser);
    const userLong = Number(longitudeUser);

    let nearestStore = allStores[0];
    let minDistance = getDistance(
      { latitude: userLat, longitude: userLong },
      { latitude: nearestStore.latitude, longitude: nearestStore.longitude },
    );

    for (const store of allStores) {
      const distance = getDistance(
        { latitude: userLat, longitude: userLong },
        { latitude: store.latitude, longitude: store.longitude },
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestStore = store;
      }
    }

    if (
      nearestStore.maxServiceDistance !== null &&
      minDistance > nearestStore.maxServiceDistance
    ) {
      res.status(403).json({
        ok: false,
        message:
          'Lokasi Anda terlalu jauh dari store. Coba menuju ke lokasi yang dekat dengan store.',
        data: null,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      message: 'Nearest store found',
      data: nearestStore,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
