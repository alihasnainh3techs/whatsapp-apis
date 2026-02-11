import whatsappService from './whatsapp.service.js';

class MessageService {
  async sendText(sessionId, number, message) {
    const sock = whatsappService.sessions.get(sessionId);
    if (!sock) {
      throw new Error(`Session ${sessionId} is not active or connected.`);
    }

    const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;

    const result = await sock.sendMessage(jid, { text: message });
    return result;
  }

  async sendLocation(sessionId, number, location) {
    const sock = whatsappService.sessions.get(sessionId);
    if (!sock) {
      throw new Error(`Session ${sessionId} is not active or connected.`);
    }

    const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;

    const result = await sock.sendMessage(jid, { location });
    return result;
  }

  async sendContact(sessionId, to, name, phone, org, isWhatsapp) {
    const sock = whatsappService.sessions.get(sessionId);
    if (!sock) {
      throw new Error(`Session ${sessionId} is not active or connected.`);
    }

    const waid = phone.replace(/\D/g, '');

    const telLine = isWhatsapp
      ? `TEL;type=CELL;type=VOICE;waid=${waid}:${phone}`
      : `TEL;type=CELL;type=VOICE:${phone}`;

    const vcard =
      'BEGIN:VCARD\n' +
      'VERSION:3.0\n' +
      `FN:${name}\n` +
      (org ? `ORG:${org};\n` : '') + // Only add ORG if it exists
      `${telLine}\n` +
      'END:VCARD';

    const jid = `${to.replace(/\D/g, '')}@s.whatsapp.net`;

    await sock.sendMessage(jid, {
      contacts: {
        displayName: name,
        contacts: [{ vcard }],
      },
    });
  }

  async sendPoll(sessionId, number, poll, values, selectableCount) {
    const sock = whatsappService.sessions.get(sessionId);
    if (!sock) {
      throw new Error(`Session ${sessionId} is not active or connected.`);
    }

    const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;

    await sock.sendMessage(jid, {
      poll: {
        name: poll,
        values: values,
        selectableCount,
        toAnnouncementGroup: false,
      },
    });
  }

  async sendLinkMessage(sessionId, number, link) {
    const sock = whatsappService.sessions.get(sessionId);
    if (!sock) {
      throw new Error(`Session ${sessionId} is not active or connected.`);
    }

    const jid = `${number.replace(/\D/g, '')}@s.whatsapp.net`;
    await sock.sendMessage(jid, {
      text: `${message} ${link}`,
    });
  }
}

export default new MessageService();
