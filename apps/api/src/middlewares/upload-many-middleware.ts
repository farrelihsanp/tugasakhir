import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

function generateRandomString(length: number) {
  let result: string = '';
  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
  }
  return result;
}

// Konfigurasi penyimpanan lokal
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/uploads');
  },

  filename: (_req, file: Express.Multer.File, cb) => {
    const uniquePrefix = `img-${Date.now()}-${generateRandomString(10)}`;
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadMany = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
    files: 5, // Maksimum 5 file
  },
});
