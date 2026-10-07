import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import morgan from 'morgan';
import { env } from './config/env.js';
import { uploadsRoot } from './config/upload.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { shopRouter } from './routes/shop/index.js';
import { adminRouter } from './routes/admin/index.js';

export const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
// Browser-facing origins — the admin app lives under a path on the customer app
// (see env.urls.adminPath), so it shares the customer origin. localhost:5173 is
// allowed outside production so the frontend can run locally against this backend.
const allowedOrigins = new Set(
  [
    env.urls.customerApp,
    env.urls.customerApp.replace('://', '://www.'),
    ...env.corsOrigins,
    ...(env.isProduction ? [] : ['http://localhost:5173']),
  ].map((origin) => origin.replace(/\/$/, '')),
);

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header means a same-origin or non-browser caller (curl, health
      // checks, server-to-server) — there is nothing to authorise.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      // Reject by withholding the header rather than throwing, so the browser
      // reports a clean CORS failure instead of a 500.
      console.warn(`[cors] blocked origin: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(morgan(env.isProduction ? 'combined' : 'dev'));
app.use('/uploads', express.static(uploadsRoot));

app.get('/health', (req, res) => res.json({ success: true, message: 'ok' }));

app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/admin', adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);
