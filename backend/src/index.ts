/**
 * DigitalStock Backend Server
 * Main entry point for the Express.js server
 * Handles restaurant management system API
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { config, validateConfig, isDevelopment } from './config/index.js';
import { testConnection, closePool } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { authMiddleware } from './middleware/auth.js';

// Import routes
import authRoutes from './routes/auth.js';
import workerRoutes from './routes/workers.js';
import inventoryRoutes from './routes/inventory.js';
import salesRoutes from './routes/sales.js';
import expensesRoutes from './routes/expenses.js';
import reportsRoutes from './routes/reports.js';
import categoriesRoutes from './routes/categories.js';
import suppliersRoutes from './routes/suppliers.js';

/**
 * Create and configure Express application
 */
const createApp = (): Application => {
  const app: Application = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (config.cors.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression middleware
  app.use(compression());

  // Logging middleware
  if (isDevelopment()) {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }

  // Rate limiting middleware
  app.use(rateLimiter);

  // Health check endpoint
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.server.nodeEnv,
      version: config.server.apiVersion,
    });
  });

  // API routes
  const apiPrefix = `/api/${config.server.apiVersion}`;

  // Public routes (no authentication required)
  app.use(`${apiPrefix}/auth`, authRoutes);

  // Protected routes (authentication required)
  app.use(`${apiPrefix}/workers`, authMiddleware, workerRoutes);
  app.use(`${apiPrefix}/inventory`, authMiddleware, inventoryRoutes);
  app.use(`${apiPrefix}/sales`, authMiddleware, salesRoutes);
  app.use(`${apiPrefix}/expenses`, authMiddleware, expensesRoutes);
  app.use(`${apiPrefix}/reports`, authMiddleware, reportsRoutes);
  app.use(`${apiPrefix}/categories`, authMiddleware, categoriesRoutes);
  app.use(`${apiPrefix}/suppliers`, authMiddleware, suppliersRoutes);

  // API documentation endpoint
  app.get(`${apiPrefix}/docs`, (req: Request, res: Response) => {
    res.json({
      title: 'DigitalStock API Documentation',
      version: config.server.apiVersion,
      description: 'Restaurant management system API',
      endpoints: {
        auth: `${apiPrefix}/auth`,
        workers: `${apiPrefix}/workers`,
        inventory: `${apiPrefix}/inventory`,
        sales: `${apiPrefix}/sales`,
        expenses: `${apiPrefix}/expenses`,
        reports: `${apiPrefix}/reports`,
        categories: `${apiPrefix}/categories`,
        suppliers: `${apiPrefix}/suppliers`,
      },
      documentation: 'https://github.com/bilyv/digitalstock/blob/main/backend/README.md'
    });
  });

  // 404 handler for undefined routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Route not found',
      message: `The requested route ${req.originalUrl} does not exist`,
      availableRoutes: [
        '/health',
        `${apiPrefix}/docs`,
        `${apiPrefix}/auth`,
        `${apiPrefix}/workers`,
        `${apiPrefix}/inventory`,
        `${apiPrefix}/sales`,
        `${apiPrefix}/expenses`,
        `${apiPrefix}/reports`,
        `${apiPrefix}/categories`,
        `${apiPrefix}/suppliers`,
      ]
    });
  });

  // Global error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};

/**
 * Check frontend connection status
 */
const checkFrontendConnection = async (): Promise<boolean> => {
  try {
    const frontendUrls = config.cors.allowedOrigins;
    let connected = false;

    for (const url of frontendUrls) {
      try {
        const response = await fetch(`${url}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
          connected = true;
          console.log(`🌐 Frontend connected: ${url}`);
          break;
        }
      } catch (error) {
        // Frontend not available at this URL, continue checking
        continue;
      }
    }

    if (!connected) {
      console.log(`⚠️  Frontend not detected on: ${frontendUrls.join(', ')}`);
      console.log(`💡 Make sure your frontend is running and accessible`);
    }

    return connected;
  } catch (error) {
    console.log(`⚠️  Could not check frontend connection: ${error.message}`);
    return false;
  }
};

/**
 * Display server information banner
 */
const displayServerInfo = (frontendConnected: boolean): void => {
  const serverUrl = `http://${config.server.host}:${config.server.port}`;
  const apiUrl = `${serverUrl}/api/${config.server.apiVersion}`;

  console.log('\n' + '='.repeat(80));
  console.log('🚀 DIGITALSTOCK BACKEND SERVER');
  console.log('='.repeat(80));
  console.log(`📍 Server URL:        ${serverUrl}`);
  console.log(`🔌 Port:              ${config.server.port}`);
  console.log(`🌍 Environment:       ${config.server.nodeEnv}`);
  console.log(`🗄️  Database:          ${config.database.host}:${config.database.port}/${config.database.name}`);
  console.log(`🔐 API Version:       ${config.server.apiVersion}`);
  console.log('─'.repeat(80));
  console.log('📚 ENDPOINTS:');
  console.log(`   Health Check:      ${serverUrl}/health`);
  console.log(`   API Docs:          ${apiUrl}/docs`);
  console.log(`   Admin Login:       ${apiUrl}/auth/admin/login`);
  console.log(`   Worker Login:      ${apiUrl}/auth/worker/login`);
  console.log(`   Workers API:       ${apiUrl}/workers`);
  console.log(`   Inventory API:     ${apiUrl}/inventory`);
  console.log(`   Sales API:         ${apiUrl}/sales`);
  console.log('─'.repeat(80));
  console.log('🌐 FRONTEND CONNECTION:');
  if (frontendConnected) {
    console.log(`   Status:            ✅ CONNECTED`);
  } else {
    console.log(`   Status:            ⚠️  NOT DETECTED`);
    console.log(`   Expected URLs:     ${config.cors.allowedOrigins.join(', ')}`);
    console.log(`   💡 Start your frontend to establish connection`);
  }
  console.log('─'.repeat(80));
  console.log('🔧 CORS Configuration:');
  console.log(`   Allowed Origins:   ${config.cors.allowedOrigins.join(', ')}`);
  console.log('='.repeat(80));
  console.log('✅ Server is ready to accept connections!');
  console.log('='.repeat(80) + '\n');
};

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Validate configuration
    validateConfig();
    console.log('✅ Configuration validated');

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }
    console.log('✅ Database connection established');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.server.port, config.server.host, async () => {
      // Check frontend connection
      const frontendConnected = await checkFrontendConnection();

      // Display comprehensive server information
      displayServerInfo(frontendConnected);

      // Set up periodic frontend connection check (every 30 seconds)
      setInterval(async () => {
        const isConnected = await checkFrontendConnection();
        if (isConnected) {
          console.log(`🔄 [${new Date().toLocaleTimeString()}] Frontend connection verified`);
        }
      }, 30000);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

      server.close(async () => {
        console.log('📴 HTTP server closed');

        try {
          await closePool();
          console.log('🔌 Database connections closed');
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

// Export for testing
export { createApp, startServer };
export default createApp;
