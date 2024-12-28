import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { Express } from 'express';
import RedisClient from './redis';
import NODE_ENV, { COOKIE_KEY } from '../constants/variables/env-constants';

/**
 * Configures Redis-based session storage for the Express application.
 * @param app - The Express application instance
 * @returns The Redis client instance
 */
export async function configureRedisStore(app: Express) {
  try {
    const redisClient = await RedisClient.getInstance(); 

    // Session with Redis store
    app.use(
      session({
        store: new RedisStore({
          client: redisClient
        }),
        secret: COOKIE_KEY, 
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          secure: NODE_ENV === 'production', // HTTPS in production
          httpOnly: true, // Prevent client-side JS access
          sameSite: 'strict', // Strict CSRF protection
        },
      })
    );

    console.log('Redis store configured successfully');
    return redisClient;
  } catch (error: any) {
    console.error('Failed to configure Redis store:', error.message || error);
    throw new Error(`Error configuring Redis store: ${error.message || error}`);
  }
}

/**
 * Gracefully closes the Redis client connection.
 */
export async function cleanupRedisStore() {
  try {
    await RedisClient.disconnect();
    console.log('Redis connection closed successfully');
  } catch (error: any) {
    console.error('Error closing Redis connection:', error.message || error);
    throw new Error(`Error closing Redis connection: ${error.message || error}`);
  }
}
