import { Request, Response, NextFunction } from "express";
import { PORT } from "../constants/variables/env-constants";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: `Please Login to Access Api's, You are not authenticated`,
        links: {
          swaggerDocs: `http://localhost:${PORT}/api-docs`,
          login: `http://localhost:${PORT}/login/google`,
        },
      });
    }
    next()
  } catch (error) {
    return next(error);
  }
};
