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
 *     description: >
 *       Redirects the user to Google's OAuth 2.0 server for authentication. This API initiates the login process
 *       by redirecting the user to Google. After successful authentication, Google will redirect the user back
 *       to the callback URL specified in the application.
 *       **Note**: This is a redirection API. Please paste this link directly into the browser, as Swagger does not support direct redirection.
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth server.
 */
router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  googleAuth
);


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
 *     description: >
 *       Returns information about the currently logged-in user. This API requires the user to be authenticated
 *       and provides details such as the user ID and email address.
 *       **Note**: This API is authenticated.
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
 *     description: >
 *       Logs out the user and redirects them to the home page. This API terminates the user session and ensures
 *       they are logged out from the application.
 *       **Note**: This API is authenticated and is a redirection API.Please paste this link directly into the browser, as Swagger does not support direct redirection.
 *     responses:
 *       302:
 *         description: Redirect to the home page after logout.
 *       401:
 *         description: Unauthorized. User is not logged in.
 */
router.get('/logout', authCheck, logout);

export default router;
