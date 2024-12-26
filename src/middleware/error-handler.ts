import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { errorResponse } from "../utils/response-helpers";
/**
 * Global error handler middleware for handling application errors
 * 
 * @param err - The error object, which could be an instance of AppError or ForbiddenError
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function in the stack
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {

    console.log(err);
    const error  = {
        message: "SOMETHING_WENT_WRONG",
        status: 500,
        error: undefined
    };

    // If error is an instance of Application Error, use its status code and message
    if (err instanceof AppError) {
        error.status = err.statusCode || 500;
        error.message = err.message
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error.error = err.originalError as any;
    }

    return res.status(error.status).json(errorResponse(error.error, error.message));
};