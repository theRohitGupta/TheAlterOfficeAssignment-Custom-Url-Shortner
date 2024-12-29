import { Request, Response } from "express";
import { successHandler } from "../middleware/success-handler";
import { TRequestUser } from "../types/req-user";

/**
 * Handles Google OAuth login
 */
export const googleAuth = () => {};

/**
 * Handles Google OAuth callback
 * @param req Express request object
 * @param res Express response object
 */
export const googleAuthCallback = (req: Request, res: Response) => {
  res.redirect("/api-docs");
};

/**
 * Gets the current logged-in user
 * @param req Express request object
 * @param res Express response object
 */
export const getCurrentUser = (req: Request, res: Response) => {
  const user =  req.user as TRequestUser
  successHandler(res, {
    status: 200,
    data: {
      _id: user._id.toString(),
      email: user.email,
      name: user.name
    },
  });
};

/**
 * Logs out the current user
 * @param req Express request object
 * @param res Express response object
 */
export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/");
  });
};
