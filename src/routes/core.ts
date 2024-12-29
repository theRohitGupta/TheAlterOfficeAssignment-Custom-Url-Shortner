import Router from 'express';
import analyticsRoutes from './analytics';
import shortUrlRoutes from './short-url';
import RateLimiterMiddleware from '../middleware/rate-limiter';
import { authCheck } from '../middleware/auth-check';

const router = Router();

router.use('/shorten', shortUrlRoutes);

router.use('/analytics', RateLimiterMiddleware, authCheck, analyticsRoutes);

export default router