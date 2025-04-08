// import { NextFunction, Request, Response } from 'express';
// import { prisma } from '../configs/prisma.js';
// import cloudinary from '../configs/cloudinary.js';
// import fs from 'node:fs/promises';
// import { getDistance } from 'geolib';

// // Create a new store
// export const createStore = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     // Destructure request body for clarity
//     const {
//       name,
//       address,
//       city,
//       province,
//       country,
//       postalCode,
//       phoneNumber,
//       latitude,
//       longitude,
//       maxServiceDistance,
//       storeAdminIds, // New field to accept store admin IDs
//     } = req.body;

//     // Validate required fields
//     if (
//       !name ||
//       !address ||
//       !city ||
//       !province ||
//       !country ||
//       !postalCode ||
//       !phoneNumber ||
//       !latitude ||
//       !longitude ||
//       !maxServiceDistance ||
//       !storeAdminIds || // Ensure storeAdminIds is provided
//       !Array.isArray(storeAdminIds) || // Ensure storeAdminIds is an array
//       storeAdminIds.length === 0 // Ensure storeAdminIds is not empty
//     ) {
//       console.log(req.body);
//       res
//         .status(400)
//         .json({ error: 'All fields are required, including storeAdminIds' });
//       return;
//     }

//     // Custom slug generation function
//     const createSlug = (input: string): string => {
//       return input
//         .toLowerCase() // Convert to lowercase
//         .replace(/[^a-z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
//     };

//     const slug = createSlug(name);

//     // Default image URL
//     let storeImage =
//       'https://res.cloudinary.com/dm1cnsldc/image/upload/v1739728940/event/images/s6x3zkhiibcahfndhmxe.jpg';

//     // Handle image upload if a file is provided
//     if (req.file) {
//       try {
//         const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'store/images',
//         });
//         storeImage = cloudinaryData.secure_url;
//         await fs.unlink(req.file.path); // Remove the file from the server after uploading
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         res.status(500).json({ error: 'Failed to upload image' });
//         return;
//       }
//     }

//     // Fetch user details to check roles
//     const users = await prisma.user.findMany({
//       where: {
//         id: {
//           in: storeAdminIds.map((id: number) => +id),
//         },
//       },
//     });

//     // Filter users with role 'STOREADMIN'
//     const validStoreAdminIds = users
//       .filter((user) => user.role === 'STOREADMIN')
//       .map((user) => user.id);

//     if (validStoreAdminIds.length === 0) {
//       res.status(400).json({ error: 'No valid store admins provided' });
//       return;
//     }

//     // Create new store entry in the database
//     const newStore = await prisma.store.create({
//       data: {
//         name,
//         address,
//         city,
//         province,
//         country,
//         postalCode,
//         phoneNumber,
//         latitude: +latitude,
//         longitude: Number(longitude),
//         maxServiceDistance: +maxServiceDistance,
//         slug,
//         storeImage,
//         StoreUser: {
//           create: validStoreAdminIds.map((id: number) => ({
//             userId: id,
//           })),
//         },
//       },
//     });

//     // Respond with the newly created store
//     res.status(201).json({
//       ok: true,
//       message: 'Store created successfully',
//       data: newStore,
//     });
//   } catch (error) {
//     console.error('Error creating store:', error);
//     next(error);
//   }
// };

// // Update an existing store
// export const updateStore = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     // Destructure request body and params for clarity
//     const {
//       name,
//       address,
//       city,
//       province,
//       country,
//       postalCode,
//       phoneNumber,
//       latitude,
//       longitude,
//       maxServiceDistance,
//       storeAdminIds, // New field to accept store admin IDs
//     } = req.body;

//     // Get the store ID from request parameters
//     const { id } = req.params; // Retrieve id from req.params

//     // Validate required fields
//     if (
//       !id || // Ensure id is provided
//       !name ||
//       !address ||
//       !city ||
//       !province ||
//       !country ||
//       !postalCode ||
//       !phoneNumber ||
//       !latitude ||
//       !longitude ||
//       !maxServiceDistance ||
//       !storeAdminIds || // Ensure storeAdminIds is provided
//       !Array.isArray(storeAdminIds) || // Ensure storeAdminIds is an array
//       storeAdminIds.length === 0 // Ensure storeAdminIds is not empty
//     ) {
//       console.log(req.body);
//       res.status(400).json({
//         error: 'All fields are required, including storeAdminIds and id',
//       });
//       return;
//     }

//     // Custom slug generation function
//     const createSlug = (input: string): string => {
//       return input
//         .toLowerCase() // Convert to lowercase
//         .replace(/[^a-z0-9]+/g, '-'); // Replace non-alphanumeric characters with hyphens
//     };

//     const slug = createSlug(name);

//     // Default image URL
//     let storeImage = undefined; // Initialize as undefined to handle no image case

//     // Handle image upload if a file is provided
//     if (req.file) {
//       try {
//         const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'store/images',
//         });
//         storeImage = cloudinaryData.secure_url;
//         await fs.unlink(req.file.path); // Remove the file from the server after uploading
//       } catch (uploadError) {
//         console.error('Cloudinary upload error:', uploadError);
//         res.status(500).json({ error: 'Failed to upload image' });
//         return;
//       }
//     }

//     // Fetch user details to check roles
//     const users = await prisma.user.findMany({
//       where: {
//         id: {
//           in: storeAdminIds.map((id: number) => +id),
//         },
//       },
//     });

//     // Filter users with role 'STOREADMIN'
//     const validStoreAdminIds = users
//       .filter((user) => user.role === 'STOREADMIN')
//       .map((user) => user.id);

//     if (validStoreAdminIds.length === 0) {
//       res.status(400).json({ error: 'No valid store admins provided' });
//       return;
//     }

//     // Fetch the store to update
//     const storeToUpdate = await prisma.store.findUnique({
//       where: { id: +id },
//     });

//     if (!storeToUpdate) {
//       res.status(404).json({ error: 'Store not found' });
//       return;
//     }

//     // Update store entry in the database
//     const updatedStore = await prisma.store.update({
//       where: { id: +id },
//       data: {
//         name,
//         address,
//         city,
//         province,
//         country,
//         postalCode,
//         phoneNumber,
//         latitude: +latitude,
//         longitude: Number(longitude),
//         maxServiceDistance: +maxServiceDistance,
//         slug,
//         storeImage:
//           storeImage !== undefined ? storeImage : storeToUpdate.storeImage, // Use existing image if no new image is provided
//         StoreUser: {
//           deleteMany: {},
//           create: validStoreAdminIds.map((id: number) => ({
//             userId: id,
//           })),
//         },
//       },
//     });

//     // Respond with the updated store
//     res.status(200).json({
//       ok: true,
//       message: 'Store updated successfully',
//       data: updatedStore,
//     });
//   } catch (error) {
//     console.error('Error updating store:', error);
//     next(error);
//   }
// };

// // Delete a store
// export const deleteStore = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { id } = req.params;

//   try {
//     await prisma.store.delete({
//       where: { id: Number(id) },
//     });
//     res.status(204).json({ message: 'Store deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// // Get a store by ID
// export const getStoreById = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { id } = req.params;

//   try {
//     const store = await prisma.store.findUnique({
//       where: { id: Number(id) },
//     });
//     if (!store) {
//       res.status(404).json({ error: 'Store not found' });
//       return;
//     }
//     res.status(200).json(store);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// // Get all stores
// export const getAllStores = async (
//   _req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const stores = await prisma.store.findMany();
//     res.status(200).json(stores);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

// export const getNearestStore = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const { latitudeUser, longitudeUser } = req.query;

//   if (!latitudeUser || !longitudeUser) {
//     res.status(400).json({ message: 'Latitude and longitude are required.' });
//     return;
//   }

//   try {
//     const stores = await prisma.store.findMany({
//       where: {
//         isActive: true,
//       },
//     });

//     if (!stores || stores.length === 0) {
//       res.status(404).json({ message: 'No active stores found.' });
//       return;
//     }

//     let nearestStore = stores[0];
//     let minDistance = getDistance(
//       { latitude: Number(latitudeUser), longitude: Number(longitudeUser) },
//       {
//         latitude: nearestStore.latitude,
//         longitude: nearestStore.longitude,
//       },
//     );

//     for (const store of stores) {
//       const distance = getDistance(
//         { latitude: Number(latitudeUser), longitude: Number(longitudeUser) },
//         { latitude: store.latitude, longitude: store.longitude },
//       );
//       if (distance < minDistance) {
//         minDistance = distance;
//         nearestStore = store;
//       }
//     }

//     res
//       .status(200)
//       .json({ ok: true, message: 'Nearest store found', data: nearestStore });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
