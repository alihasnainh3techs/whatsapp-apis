import { SESSION_COLLECTION } from '../constants.js';
import database from '../db/connection.js';

class SessionRepository {
  get collection() {
    return database.getDB().collection(SESSION_COLLECTION);
  }

  async getSessions() {
    return await this.collection
      .find({}, { projection: { _id: 0 } })
      .sort({ updatedAt: -1 })
      .toArray();
  }

  async getSessionById(sessionId) {
    return await this.collection.findOne({ sessionId: sessionId });
  }

  async deleteSession(sessionId) {
    return await this.collection.deleteOne({ sessionId });
  }

  async updateSession({ sessionId, status, lastDisconnectedAt = null }) {
    await this.collection.updateOne(
      { sessionId },
      {
        $set: {
          status,
          lastDisconnectedAt,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          sessionId,
        },
      },
      { upsert: true },
    );
  }
}

export default new SessionRepository();
