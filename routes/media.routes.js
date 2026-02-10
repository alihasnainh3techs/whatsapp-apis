import mediaController from '../controllers/media.controller.js';
import {
  uploadImage,
  uploadVideo,
  uploadAudio,
} from '../middlewares/multer.js';
import { Router } from 'express';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.post(
  '/gif',
  uploadVideo.single('media'),
  asyncHandler(mediaController.gifMessage),
);
router.post(
  '/image',
  uploadImage.single('media'),
  asyncHandler(mediaController.imageMessage),
);
router.post(
  '/video',
  uploadVideo.single('media'),
  asyncHandler(mediaController.videoMessage),
);
router.post(
  '/audio',
  uploadAudio.single('media'),
  asyncHandler(mediaController.audioMessage),
);

export default router;
