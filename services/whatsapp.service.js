import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys';
import logger from '../utils/logger.js';
import webhookService from './webhook.service.js';
import devicesRepo from '../repositories/devices.repo.js';
import QRCode from 'qrcode';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __filepath = fileURLToPath(import.meta.url);
const __dir = path.resolve(path.dirname(__filepath), '..');

const authDir = path.join(__dir, 'auth');

class WhatsAppService {
  constructor() {
    this.sessions = new Map();
  }

  async deleteSession(sessionId) {
    const sock = this.sessions.get(sessionId);
    if (sock) {
      await sock.logout();
      this.sessions.delete(sessionId);
    }

    const sessionPath = path.join(authDir, sessionId);
    try {
      await fs.rm(sessionPath, { recursive: true, force: true });
      console.log(`Cleaned up session folder: ${sessionId}`);
    } catch (err) {
      console.error(`Error deleting session ${sessionId}:`, err);
    }
  }

  async generateQR(sessionId) {
    return new Promise(async (resolve, reject) => {
      try {
        const sessionPath = path.join(authDir, sessionId);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

        const sock = makeWASocket({
          auth: state,
          logger: logger,
          version: [2, 3000, 1033893291],
        });

        sock.ev.on('connection.update', async (update) => {
          const { connection, qr, isOnline, isNewLogin, lastDisconnect } =
            update;

          if (qr) {
            console.log(await QRCode.toString(qr, { type: 'terminal' }));

            const qrDataURL = await QRCode.toDataURL(qr);
            resolve({
              qrCode: qrDataURL,
              message: 'QR code generated successfully.',
            });
          }

          if (connection === 'close') {
            const shouldReconnect =
              lastDisconnect.error?.output?.statusCode !==
              DisconnectReason.loggedOut;
            console.log(
              'connection closed due to ',
              lastDisconnect.error,
              ', reconnecting ',
              shouldReconnect,
            );

            const phone = sock.user?.id?.split('@')[0] || null;
            const lastDisconnectedAt = new Date();
            const status = 'disconnected';

            // reconnect if not logged out
            if (shouldReconnect) {
              await devicesRepo.updateDeviceSession(sessionId, {
                status: 'disconnected',
                lastDisconnectedAt: new Date(),
              });

              await webhookService.emit('device.disconnected', {
                sessionId,
                phone,
                status,
                lastDisconnectedAt,
              });

              this.sessions.delete(sessionId);

              this.generateQR(sessionId).catch(console.error);
            } else {
              this.sessions.delete(sessionId);

              // when logout called
              const isIntentionalLogout = lastDisconnect.error?.output?.payload?.message === 'Intentional Logout';

              if (
                isIntentionalLogout ||
                lastDisconnect.error?.data?.attrs?.type === 'device_removed'
              ) {
                await devicesRepo.deleteDeviceBySessionId(sessionId);

                // also clean up the session files on disk
                await this.deleteSession(sessionId);
              } else {
                await devicesRepo.updateDeviceSession(sessionId, {
                  status: 'disconnected',
                  lastDisconnectedAt: new Date(),
                });

                await webhookService.emit('device.disconnected', {
                  sessionId,
                  phone,
                  status,
                  lastDisconnectedAt,
                });
              }
            }
          } else if (connection === 'open') {
            this.sessions.set(sessionId, sock);

            // Extract phone number from JID (e.g., '1234567890@s.whatsapp.net' → '1234567890')
            const phone = sock.user?.id?.split(':')[0] || null;
            const status = 'connected';

            await devicesRepo.updateDeviceSession(sessionId, {
              status,
              lastDisconnectedAt: null,
              phone,
            });

            await webhookService.emit('device.connected', {
              sessionId,
              phone,
              status,
            });

            console.log('opened connection');

            resolve({ message: 'Session opened successfully.' });
          }
        });
        
        sock.ev.on('creds.update', saveCreds);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new WhatsAppService();
