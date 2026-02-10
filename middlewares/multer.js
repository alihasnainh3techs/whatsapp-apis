import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), '..');

const BASE_UPLOAD_PATH = path.join(__dirname, 'public', 'uploads');

const diskStorage = (folder) => {
  const uploadPath = path.join(BASE_UPLOAD_PATH, folder);

  return multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });
};

/**
 * Image upload
 */
export const uploadImage = multer({
  storage: diskStorage('images'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'));
    }
    cb(null, true);
  },
});

/**
 * Video upload
 */
export const uploadVideo = multer({
  storage: diskStorage('videos'),
  limits: { fileSize: 16 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files allowed'));
    }
    cb(null, true);
  },
});

/**
 * Audio upload
 */
export const uploadAudio = multer({
  storage: diskStorage('audios'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files allowed'));
    }
    cb(null, true);
  },
});
