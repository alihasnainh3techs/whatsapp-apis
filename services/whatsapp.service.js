import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys';
import { io } from '../app.js';
import logger from '../utils/logger.js';
import sessionRepo from '../repositories/session.repo.js';
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
    const sessionPath = path.join(authDir, sessionId);
    try {
      await fs.rm(sessionPath, { recursive: true, force: true });
      console.log(`Cleaned up session folder: ${sessionId}`);
    } catch (err) {
      console.error(`Error deleting session ${sessionId}:`, err);
    }
  }

  async logoutSession(sessionId) {
    const sock = this.sessions.get(sessionId);
    if (sock) {
      await sock.logout();
      this.sessions.delete(sessionId);
      await this.deleteSession(sessionId);
    }
  }

  async generateQR(sessionId) {
    const sessionPath = path.join(authDir, sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
      auth: state,
      logger: logger,
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, qr, isOnline, isNewLogin, lastDisconnect } = update;

      if (qr) {
        console.log(await QRCode.toString(qr, { type: 'terminal' }));

        const qrDataUrl = await QRCode.toDataURL(qr);
        io.to(sessionId).emit('qr', {
          QRCode: qrDataUrl,
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

        // reconnect if not logged out
        if (shouldReconnect) {
          await sessionRepo.updateSession({
            sessionId,
            status: 'disconnected',
            lastDisconnectedAt: new Date(),
          });

          this.sessions.delete(sessionId);

          io.to(sessionId).emit('connection_status', {
            status: 'disconnected',
            reconnecting: shouldReconnect,
          });

          this.generateQR(sessionId);
        } else {
          io.to(sessionId).emit('connection_status', {
            status: 'disconnected',
            reconnecting: shouldReconnect,
          });

          this.sessions.delete(sessionId);

          await this.deleteSession(sessionId);

          if (lastDisconnect.error?.data?.attrs?.type === 'device_removed') {
            await sessionRepo.deleteSession(sessionId);
          } else {
            await sessionRepo.updateSession({
              sessionId,
              status: 'disconnected',
              lastDisconnectedAt: new Date(),
            });
          }
        }
      } else if (connection === 'open') {
        io.to(sessionId).emit('connection_status', { status: 'connected' });

        this.sessions.set(sessionId, sock);

        await sessionRepo.updateSession({
          sessionId,
          status: 'connected',
          lastDisconnectedAt: null,
        });
        console.log('opened connection');
      }
    });

    sock.ev.on('creds.update', saveCreds);
  }
}

export default new WhatsAppService();
