import { Router } from 'express';
import messageController from '../controllers/message.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.post('/text', asyncHandler(messageController.textMessage));
router.post('/location', asyncHandler(messageController.locationMessage));
router.post('/contact', asyncHandler(messageController.contactMessage));
router.post('/poll', asyncHandler(messageController.pollMessage));
router.post('/link-preview', asyncHandler(messageController.linkMessage));

export default router;
