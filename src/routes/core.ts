import Router from 'express';
import shortUrlRoutes from './short-url';
import { authCheck } from '../middleware/auth-check';

const router = Router();

router.use('/shorten', shortUrlRoutes);

router.use('/analytics', authCheck, shortUrlRoutes);

export default router