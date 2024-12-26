import express from 'express';
import passport from 'passport';
import {
  getCurrentUser,
  googleAuth,
  googleAuthCallback,
  logout,
} from '../controllers/auth';
import { authCheck } from '../middleware/auth-check';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication management API
 */

/**
 * @swagger
 * /login/google:
 *   get:
 *     tags: [Authentication]
 *     summary: Initiates Google OAuth login
 *     description: Redirects the user to Google's OAuth 2.0 server for authentication.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth server.
 */
router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  googleAuth
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Handles Google OAuth callback
 *     description: Handles the callback from Google after authentication.
 *     responses:
 *       302:
 *         description: Redirect to the home page upon successful authentication.
 *       401:
 *         description: Authentication failed. Redirect to the login page.
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleAuthCallback
);

/**
 * @swagger
 * /current_user:
 *   get:
 *     tags: [Authentication]
 *     summary: Get current logged-in user
 *     description: Returns information about the currently logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier of the user.
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *       401:
 *         description: Unauthorized. User is not logged in.
 */
router.get('/current_user', authCheck, getCurrentUser);

/**
 * @swagger
 * /logout:
 *   get:
 *     tags: [Authentication]
 *     summary: Logs out the current user
 *     description: Logs out the user and redirects them to the home page.
 *     responses:
 *       302:
 *         description: Redirect to the home page after logout.
 *       401:
 *         description: Unauthorized. User is not logged in.
 */
router.get('/logout', authCheck, logout);

export default router;
