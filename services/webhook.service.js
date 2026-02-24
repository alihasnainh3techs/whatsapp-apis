import axios from 'axios';

class WebhookService {
  async emit(event, payload) {
    try {
      const response = await axios.post(process.env.WEBHOOK_URL, {
        event,
        data: payload,
      });
      return response.data;
    } catch (error) {
      console.error('Webhook error:', error.message);
      return null;
    }
  }
}

export default new WebhookService();
