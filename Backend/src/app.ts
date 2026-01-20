import express, { Express } from 'express';
import plannerRoutes from './routes/planner.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { logger } from './utils/logger';
import { initializeFirebase } from './config/firebase';
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite
  'http://127.0.0.1:5173',
  // add more later:
  // 'https://yourdomain.com',
];
export function createApp(): Express {
  const app = express();

  // Initialize Firebase
  try {
    initializeFirebase();
  } catch (error) {
    logger.warn('Firebase initialization failed - some features may not work', { error });
  }

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: (origin, callback) => {
        // allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    next();
  });

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Check Firebase connection
      const { getFirestore } = await import('./config/firebase');
      await getFirestore().collection('health').limit(1).get();

      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: { firebase: 'connected' },
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        timestamp: new Date().toISOString(),
        services: { firebase: 'disconnected' },
      });
    }
  });

  // API Routes
  app.use('/planner', plannerRoutes);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found',
    });
  });

  // Error handling middleware (must be last)
  app.use(errorMiddleware);

  return app;
}
