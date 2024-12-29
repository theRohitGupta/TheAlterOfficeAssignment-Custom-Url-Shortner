import Router from 'express';
import { swaggerDocs, swaggerUi } from '../config/swagger';
import authRoutes from './auth';
import coreRoutes from './core';

const router = Router();

router.use(authRoutes);

// Serve Swagger UI
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

router.use('/api', coreRoutes);

export default router