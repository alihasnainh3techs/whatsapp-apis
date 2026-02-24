import dotenv from 'dotenv';
import { app } from './app.js';
import connectDB from './db/connection.js';

dotenv.config();

connectDB();

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
