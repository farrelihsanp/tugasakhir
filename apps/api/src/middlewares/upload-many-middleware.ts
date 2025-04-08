import multer from 'multer';
import path from 'path';

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
  filename: (_req, file, cb) => {
    const uniquePrefix = `img-${Date.now()}-${generateRandomString(10)}`;
    cb(null, uniquePrefix + path.extname(file.originalname));
  },
});

// File filter untuk memastikan hanya gambar yang diunggah
const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const uploadMany = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    files: 5, // Maksimum 5 file
  },
});
