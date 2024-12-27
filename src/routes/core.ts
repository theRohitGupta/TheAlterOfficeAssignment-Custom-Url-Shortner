import Router from 'express';
import analyticsRoutes from './analytics';
import shortUrlRoutes from './short-url';

const router = Router();

router.use('/shorten', shortUrlRoutes);

router.use('/analytics', analyticsRoutes);

export default router