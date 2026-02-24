import dotenv from 'dotenv';
import { app } from './app.js';
import database from './db/connection.js';

dotenv.config();

database.connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
