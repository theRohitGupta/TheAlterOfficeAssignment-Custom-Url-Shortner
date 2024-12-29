import Router from 'express';
import RateLimiterMiddleware from '../middleware/rate-limiter';
import { createShortUrl } from '../controllers/short-url/create';
import { getShortUrlByCustomAlias } from '../controllers/short-url/get-by-custom-alias';
import { authCheck } from '../middleware/auth-check';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: ShortUrl
 *   description: Short URL management API
 */

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a new short URL
 *     description: Allows a user to create a short URL with an optional custom alias. You must be authenticated to use this endpoint.
 *     tags: [ShortUrl]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               longUrl:
 *                 type: string
 *                 description: The original long URL to be shortened
 *                 example: "https://example.com/some-long-url"
 *               alias:
 *                 type: string
 *                 description: Custom alias for the short URL (optional)
 *                 example: "my-custom-alias"
 *               topic:
 *                 type: string
 *                 description: Topic category for the short URL (optional)
 *                 example: "activation"
 *     responses:
 *       201:
 *         description: Successfully created short URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shortUrl:
 *                   type: string
 *                   description: The generated short URL
 *                   example: "https://short.ly/my-custom-alias"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Timestamp of when the short URL was created
 *                   example: "2024-01-01T12:00:00Z"
 *       400:
 *         description: Validation error or invalid request data
 */
router.post('/',  RateLimiterMiddleware, authCheck, createShortUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Retrieve the original URL by custom alias
 *     description: Redirects the user to the original long URL corresponding to the provided custom alias.
 *       **Note**: This is a redirection API. Please paste this link directly into the browser, as Swagger does not support direct redirection.
 *     tags: [ShortUrl]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         description: Custom alias of the short URL
 *         schema:
 *           type: string
 *           example: "my-custom-alias"
 *     responses:
 *       302:
 *         description: Redirect to the original long URL
 *         headers:
 *           Location:
 *             description: The original long URL
 *             schema:
 *               type: string
 *               example: "https://example.com/some-long-url"
 *       404:
 *         description: Custom alias not found
 */
router.get('/:alias', getShortUrlByCustomAlias);

export default router;
