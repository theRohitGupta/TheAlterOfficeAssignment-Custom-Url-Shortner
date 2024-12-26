import { Response } from "express";

export const successHandler = (
    res: Response,
    {
        message = 'REQUEST_COMPLETED_SUCCESSFULLY', // Default message
        data = {}, // Default data
        status = 200 // Default status code
    }: {
        message?: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?: any,
        status?: number
    }
) => {

    // Send the response
    res.status(status).json({
        success: true,
        message,
        data,
    });
};