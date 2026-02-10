import dotenv from 'dotenv';
import { io, server } from './app.js';
import database from './db/connection.js';

dotenv.config();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined room ${sessionId}`);
  });
});

database.connectDB();

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
