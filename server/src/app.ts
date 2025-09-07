import express from 'express';
import 'dotenv/config';
import apiRouter from './routes';
import { errorHandler } from './http/error';
import cors, { CorsOptions } from 'cors';

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const corsOptions: CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    return allowedOrigins.includes(origin)
      ? cb(null, true)
      : cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/', apiRouter);
app.use(errorHandler);

export default app;
