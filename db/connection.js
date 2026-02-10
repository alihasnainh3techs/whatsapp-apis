import { MongoClient } from 'mongodb';
import { DB_NAME } from '../constants.js';

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connectDB() {
    try {
      this.client = new MongoClient(process.env.MONGODB_URI);
      await this.client.connect();
      this.db = this.client.db(DB_NAME);
      console.log('DB connected');
    } catch (error) {
      console.error('Error db connection: ', error.message);
      process.exit(1);
    }
  }

  getDB() {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db;
  }
}

export default new Database();
