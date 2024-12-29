import express, { Request, Response } from 'express';
import passport from 'passport';
import connectDB from './config/database';
import { cleanupRedisStore, configureRedisStore } from './config/redis-store';
import { PORT } from './constants/variables/env-constants';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import apiRoutes from './routes/index';
import './services/passport';
import { TRequestUser } from './types/req-user';

const app = express();

// Initialize Express and Redis Store
async function initializeApp() {
  try {
    // Basic middleware
    app.use(express.json());

    // Configure Redis store and session
    await configureRedisStore(app);

    // Initialize Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Routes
    app.use(apiRoutes);

    // Welcome route
    app.get("/", (req: Request, res: Response) => {
      const isAuthenticated = req.isAuthenticated();
      const user = req.user as TRequestUser | undefined;
    
      const responsePayload = {
        success: true,
        message: isAuthenticated
          ? `Welcome to The Alter Office Assignment Server!`
          : `Welcome to The Alter Office Assignment Server! \n You must log in to access the API's`,
        links: {
          swaggerDocs: `http://localhost:${PORT}/api-docs`,
          ...(isAuthenticated
            ? { logout: `http://localhost:${PORT}/logout` }
            : { login: `http://localhost:${PORT}/login/google` }),
        },
        ...(isAuthenticated && user
          ? { user: { email: user.email, name: user.name } }
          : {}),
      };
    
      res.status(200).json(responsePayload);
    });

    // Error handlers
    app.use(notFoundHandler);
    app.use(errorHandler);

  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
}

// Graceful shutdown handler
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM signal. Starting graceful shutdown...');
  await cleanupRedisStore();
  process.exit(0);
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Initialize Express app with Redis store
    await initializeApp();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the application
startServer();

export default app;