import P from 'pino';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filepath = fileURLToPath(import.meta.url);
const __dir = path.resolve(path.dirname(__filepath), '..');

const logFilePath = path.join(__dir, 'logs', 'baileys.log');
const logger = P(
  {
    level: 'debug',
  },
  P.destination(logFilePath),
);

export default logger;
