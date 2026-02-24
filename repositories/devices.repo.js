import { Device } from '../models/device.modal.js';

class DevicesRepository {
  async getDeviceBySessionId(sessionId) {
    return await Device.findOne({ sessionId });
  }

  async updateDeviceSession(sessionId, sessionData) {
    return await Device.updateOne(
      { sessionId },
      { $set: { ...sessionData } },
      { upsert: true },
    );
  }

  async getAllDevices() {
    return await Device.find({});
  }

  async deleteDeviceBySessionId(sessionId) {
    return await Device.deleteOne({ sessionId });
  }
}

export default new DevicesRepository();
