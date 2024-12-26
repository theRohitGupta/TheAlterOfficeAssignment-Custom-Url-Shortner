import { Request, Response } from "express"
import { errorResponse } from "../utils/response-helpers"

/**
 * Middleware to handle 404 Not Found errors.
 * 
 * This function gets triggered when a request is made to a route that does not exist.
 * It returns a 404 status code and an error response with a "Route Not Found" message.
 * 
 * @param req - The Express request object
 * @param res - The Express response object
 */

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json(errorResponse({}, 'ROUTE_NOT_FOUND'))
}