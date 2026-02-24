import whatsappService from '../services/whatsapp.service.js';
import devicesRepo from '../repositories/devices.repo.js';
import { APIError } from '../utils/api-error.js';
import { APIResponse } from '../utils/api-response.js';

class AuthController {
  getAllSessions = async (req, res) => {
    const devices = await devicesRepo.getAllDevices();
    res.status(200).json(new APIResponse(200, 'Ok', { devices }));
  };

  startAllSessions = async (req, res) => {
    const devices = await devicesRepo.getAllDevices();
    if (!devices || devices.length === 0) {
      return res
        .status(404)
        .json(new APIResponse(404, 'No sessions found to start.'));
    }

    const startPromises = devices.map(async (device) => {
      // We check if the session is already active in memory to avoid duplicate sockets
      if (!whatsappService.sessions.has(device.sessionId)) {
        return whatsappService.generateQR(device.sessionId);
      }
    });

    await Promise.all(startPromises);

    res
      .status(200)
      .json(
        new APIResponse(
          200,
          `${devices.length} sessions are being initialized.`,
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

    if (whatsappService.sessions.has(id)) {
      return res
        .status(200)
        .json(new APIResponse(200, 'Session is already active and connected.'));
    }

    const response = await whatsappService.generateQR(id);

    res.status(200).json(new APIResponse(201, response?.message, response));
  };

  deleteSession = async (req, res) => {
    const { id } = req.params;
    if (!id.trim()) {
      res
        .status(400)
        .json(new APIError(400, 'Session ID is required to delete session.'));
    }

    await whatsappService.deleteSession(id);

    res
      .status(200)
      .json(
        new APIResponse(200, 'Session deleted successfully.'),
      );
  };
}

export default new AuthController();
