import mediaService from '../services/media.service.js';
import { APIResponse } from '../utils/api-response.js';

class Media {
  gifMessage = async (req, res) => {
    const { id, number, caption } = req.body;
    const media = req.file;

    const result = await mediaService.sendGifMessage(
      id,
      number,
      caption,
      media,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Gif message sent successfully.', result));
  };

  imageMessage = async (req, res) => {
    const { id, number, caption, viewOnce } = req.body;

    console.log("Req Body: ", req.body);


    const media = req.file;

    const result = await mediaService.sendImageMessage(
      id,
      number,
      caption,
      viewOnce,
      media,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Image message sent successfully.', result));
  };

  videoMessage = async (req, res) => {
    const { id, number, caption, viewOnce } = req.body;
    const media = req.file;

    const result = await mediaService.sendVideoMessage(
      id,
      number,
      caption,
      media,
      viewOnce,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Video message sent successfully.', result));
  };

  audioMessage = async (req, res) => {
    const { id, number, viewOnce } = req.body;
    const media = req.file;

    const result = await mediaService.sendAudioMessage(
      id,
      number,
      media,
      viewOnce,
    );

    res
      .status(200)
      .json(new APIResponse(200, 'Audio message sent successfully.', result));
  };
}

export default new Media();
