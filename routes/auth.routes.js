import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();

router.route('/:id/qrcode-session').get(asyncHandler(authController.getQrCode));
router
  .route('/:id/logout-session')
  .get(asyncHandler(authController.logoutSession));
router
  .route('/show-all-sessions')
  .get(asyncHandler(authController.showAllSessions));
router.route('/start-all').get(asyncHandler(authController.startAllSessions));
router
  .route('/:id/start-session')
  .get(asyncHandler(authController.startSession));

export default router;
