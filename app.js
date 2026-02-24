import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filepath = fileURLToPath(import.meta.url);
const __dir = path.dirname(__filepath);

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dir, 'public')));

// routes
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import mediaRoutes from './routes/media.routes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/media', mediaRoutes);

app.use(errorHandler);

export { app };
