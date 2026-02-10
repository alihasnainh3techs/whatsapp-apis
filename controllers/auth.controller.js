import whatsappService from '../services/whatsapp.service.js';
import sessionRepo from '../repositories/session.repo.js';
import { APIError } from '../utils/api-error.js';
import { APIResponse } from '../utils/api-response.js';

class AuthController {
  showAllSessions = async (req, res) => {
    const sessions = await sessionRepo.getSessions();
    res
      .status(200)
      .json(
        new APIResponse(200, 'Sessions retrieved successfully.', { sessions }),
      );
  };

  startAllSessions = async (req, res) => {
    const sessions = await sessionRepo.getSessions();
    if (!sessions || sessions.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, 'No sessions found to start.'));
    }

    const startPromises = sessions.map(async (session) => {
      // We check if the session is already active in memory to avoid duplicate sockets
      if (!whatsappService.sessions.has(session.sessionId)) {
        return whatsappService.generateQR(session.sessionId);
      }
    });

    await Promise.all(startPromises);

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          `${sessions.length} sessions are being initialized.`,
        ),
      );
  };

  startSession = async (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
      return res
        .status(400)
        .json(new APIError(400, 'Session ID is required to start session.'));
    }

    const session = await sessionRepo.getSessionById(id);
    if (!session) {
      return res.status(404).json(new APIResponse(404, 'Session not found.'));
    }

    if (whatsappService.sessions.has(id)) {
      return res
        .status(200)
        .json(new APIResponse(200, 'Session is already active and connected.'));
    }

    await whatsappService.generateQR(id);

    res
      .status(200)
      .json(
        new APIResponse(
          201,
          'QR code generation started. Scan will appear in your session.',
        ),
      );
  };

  getQrCode = async (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
      res
        .status(400)
        .json(new APIError(400, 'Session ID is required to generate QR code.'));
    }

    await whatsappService.generateQR(id);

    res
      .status(200)
      .json(
        new APIResponse(
          201,
          'QR code generation started. Scan will appear in your session.',
        ),
      );
  };

  logoutSession = async (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
      res
        .status(400)
        .json(new APIError(400, 'Session ID is required to logout session.'));
    }

    await whatsappService.logoutSession(id);

    res
      .status(200)
      .json(new APIResponse(200, 'Session logged out successfully.'));
  };
}

export default new AuthController();
