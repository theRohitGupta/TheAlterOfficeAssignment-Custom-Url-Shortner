import swaggerJsDoc, { Options } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { PORT } from "../constants/variables/env-constants";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Custom URL Shortener API - By Rohit Gupta",
      version: "1.0.0",
      description: `
### Objective
The Custom URL Shortener API simplifies sharing long URLs by creating short, easily manageable links. It includes:

- **Advanced Analytics**: View detailed analytics for both individual and aggregated URL usage.
- **User Authentication**: Secure login via Google Sign-In.
- **Rate Limiting**: Ensures scalability and protects against abuse.
- **Link Grouping**: Organize URLs under categories like _acquisition_, _activation_, and _retention_.

### Disclaimer
⚠️ **Note**: **Redirect APIs** may not work via Swagger UI. Instead, copy and paste the URLs directly into your browser for them to work as expected.
      `,
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Local server for development",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Update this to match the location of your API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
