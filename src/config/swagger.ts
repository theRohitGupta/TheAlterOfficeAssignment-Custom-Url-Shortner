import swaggerJsDoc, { Options } from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { PORT } from '../constants/variables/env-constants';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`, // Replace with your server URL
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to your API files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };

