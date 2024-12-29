import Router from 'express';
import { getOverallAnalytics } from '../controllers/analytics/overall';
import { getTopicAnalytics } from '../controllers/analytics/topic-based';
import { getUrlAnalytics } from '../controllers/analytics/url-alias';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Analytics
 *     description: Analytics management API
 */

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get overall analytics for the user
 *     description: Retrieve overall analytics information for the authenticated user, including total URLs, total clicks, unique users, and other metrics.
 *     responses:
 *       200:
 *         description: Successfully retrieved overall analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUrls:
 *                   type: integer
 *                   description: Total number of URLs created by the user.
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for all URLs created by the user.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who clicked the URLs created by the user.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the clicks.
 *                       clickCount:
 *                         type: integer
 *                         description: Number of clicks on that date.
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       osName:
 *                         type: string
 *                         description: Operating system type.
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from this OS.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users using this OS.
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       deviceName:
 *                         type: string
 *                         description: Device type.
 *                       uniqueClicks:
 *                         type: integer
 *                         description: Number of unique clicks from this device.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users using this device.
 *       404:
 *         description: No URLs found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no URLs were found for the user.
 *       500:
 *         description: Internal server error.
 */
router.get('/overall', getOverallAnalytics)

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get URL analytics by topic
 *     description: Retrieve analytics information for a given topic, including total clicks, unique users, and other metrics.
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *         description: The topic for which analytics data is requested.
 *     responses:
 *       200:
 *         description: Successfully retrieved topic analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for the topic.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who clicked the URLs under the topic.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the clicks.
 *                       clickCount:
 *                         type: integer
 *                         description: Number of clicks on that date.
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       shortUrl:
 *                         type: string
 *                         description: The alias of the short URL.
 *                       totalClicks:
 *                         type: integer
 *                         description: Total number of clicks for the short URL.
 *                       uniqueUsers:
 *                         type: integer
 *                         description: Number of unique users who clicked the short URL.
 *       404:
 *         description: No URLs found for the specified topic.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating no URLs were found for the topic.
 *       500:
 *         description: Internal server error.
 */
router.get('/topic/:topic', getTopicAnalytics)

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get URL analytics by alias
 *     description: Retrieve analytics information for a given URL alias, including total clicks, unique users, and other metrics.
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: The alias of the URL for which analytics data is requested.
 *     responses:
 *       200:
 *         description: Successfully retrieved URL analytics.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClicks:
 *                   type: integer
 *                   description: Total number of clicks for the URL alias.
 *                 uniqueUsers:
 *                   type: integer
 *                   description: Number of unique users who clicked the URL.
 *                 clicksByDate:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the clicks.
 *                       count:
 *                         type: integer
 *                         description: Number of clicks on that date.
 *                 osType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       os:
 *                         type: string
 *                         description: Operating system type.
 *                       count:
 *                         type: integer
 *                         description: Number of users using this OS.
 *                 deviceType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       device:
 *                         type: string
 *                         description: Device type.
 *                       count:
 *                         type: integer
 *                         description: Number of users using this device.
 *       404:
 *         description: URL alias not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the alias was not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:alias', getUrlAnalytics);


export default router;
