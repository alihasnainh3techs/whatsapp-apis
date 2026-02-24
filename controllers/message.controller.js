import messageService from '../services/message.service.js';
import { APIResponse } from '../utils/api-response.js';

class Messages {
  textMessage = async (req, res) => {
    const { id, number, message } = req.body;

    const result = await messageService.sendText(id, number, message);

    res
      .status(200)
      .json(new APIResponse(200, 'Message sent successfully.', result));
  };

  locationMessage = async (req, res) => {
    const { id, number, location } = req.body;

    const result = await messageService.sendLocation(id, number, location);

    res
      .status(200)
      .json(new APIResponse(200, 'Location sent successfully.', result));
  };

  contactMessage = async (req, res) => {
    const { id, to, name, phone, org, isWhatsapp } = req.body;

    const result = await messageService.sendContact(
      id,
      to,
      name,
      phone,
      org,
      isWhatsapp,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Contact sent successfully.', result));
  };

  pollMessage = async (req, res) => {
    const { id, number, poll, values, selectableCount } = req.body;

    const result = await messageService.sendPoll(
      id,
      number,
      poll,
      values,
      selectableCount,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Poll sent successfully.', result));
  };

  linkMessage = async (req, res) => {
    const { id, number, link } = req.body;

    const result = await messageService.sendLinkMessage(id, number, link);

    res
      .status(200)
      .json(new APIResponse(200, 'Link sent successfully.', result));
  };
}

export default new Messages();
