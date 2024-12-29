import { Request, Response, NextFunction } from "express";
import { HOSTED_IP, PORT } from "../constants/variables/env-constants";

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
          swaggerDocs: `${HOSTED_IP}${PORT}/api-docs`,
          login: `${HOSTED_IP}${PORT}/login/google`,
        },
      });
    }
    next()
  } catch (error) {
    return next(error);
  }
};
