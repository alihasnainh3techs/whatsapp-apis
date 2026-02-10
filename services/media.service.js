import fs from "node:fs/promises";
import whatsappService from './whatsapp.service.js';

class MediaService {

  async clearMedia(filePath) {
    try {
      if (filePath) {
        await fs.unlink(filePath);
        console.log(`Successfully deleted: ${filePath}`);
      }
    } catch (error) {
      console.error(`Failed to delete file at ${filePath}:`, error.message);
      // We don't throw here to avoid crashing the main response if cleanup fails
    }
  }

  async sendGifMessage(sessionId, number, caption, media) {
    try {
      const sock = whatsappService.sessions.get(sessionId);
      if (!sock) {
        throw new Error(`Session ${sessionId} is not active or connected.`);
      }

      const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;

      const result = await sock.sendMessage(jid, {
        video: {
          url: media?.path,
        },
        caption,
        gifPlayback: true,
      });
      return result;
    } finally {
      await this.clearMedia(media?.path);
    }
  }

  async sendImageMessage(sessionId, number, caption, viewOnce, media) {

    console.log("View onece: ", viewOnce);


    try {
      const sock = whatsappService.sessions.get(sessionId);
      if (!sock) {
        throw new Error(`Session ${sessionId} is not active or connected.`);
      }

      const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;

      const result = await sock.sendMessage(jid, {
        image: {
          url: media?.path,
        },
        caption,
        viewOnce,
      });
      return result;
    } finally {
      await this.clearMedia(media?.path);
    }
  }

  async sendVideoMessage(sessionId, number, caption, media, viewOnce) {
    try {
      const sock = whatsappService.sessions.get(sessionId);
      if (!sock) {
        throw new Error(`Session ${sessionId} is not active or connected.`);
      }

      const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
      const result = await sock.sendMessage(jid, {
        video: {
          url: media?.path,
        },
        caption,
        viewOnce: viewOnce === 'true'
      });
      return result;
    } finally {
      await this.clearMedia(media?.path);
    }
  }

  async sendAudioMessage(sessionId, number, media, viewOnce) {
    try {
      const sock = whatsappService.sessions.get(sessionId);
      if (!sock) {
        throw new Error(`Session ${sessionId} is not active or connected.`);
      }

      const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
      const result = await sock.sendMessage(jid, {
        audio: {
          url: media?.path,
        },
        viewOnce: viewOnce === 'true',
        mimetype: 'audio/mp4',
      });
      return result;
    } finally {
      await this.clearMedia(media?.path);
    }
  }
}

export default new MediaService();
