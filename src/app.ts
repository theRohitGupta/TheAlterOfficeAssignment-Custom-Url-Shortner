import express, { Request, Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import { COOKIE_KEY, MONGO_DB_URI, PORT } from './constants/variables/env-constants';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import apiRoutes from './routes/index';
import './services/passport';
import connectDB from './config/database';

const app = express();

// Middleware
app.use(express.json());

// Replace cookie-session with express-session
app.use(
  session({
    secret: COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(apiRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: `Welcome to The Alter Office Assignment Server! \n You Must Login to access the API's`,
    links: {
      swaggerDocs: `http://localhost:${PORT}/api-docs`,
      login: `http://localhost:${PORT}/login/google`,
    },
  });
});

/*
 * Handler for managing 404 Not Found errors
 */
app.use(notFoundHandler);

// Connect to MongoDB
(async() => connectDB())()

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*
 * Global error handler to manage application errors
 */
app.use(errorHandler)