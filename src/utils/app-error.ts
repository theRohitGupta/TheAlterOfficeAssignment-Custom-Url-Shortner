export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly originalError?: unknown; // The original error (if any)

    /**
     * Creates a new AppError instance.
     * 
     * @param message - The error message.
     * @param statusCode - The HTTP status code (e.g., 400 for Bad Request, 500 for Server Error).
     * @param isOperational - Whether the error is operational (i.e., expected/trusted error).
     * @param error - The original error or detailed error object (optional).
     */
    constructor(message: string, statusCode: number, error?: unknown, isOperational: boolean = false) {
        super(message); // Pass the message to the parent Error class
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.originalError = error;

        // Set the prototype explicitly (required for extending Error in TypeScript)
        Object.setPrototypeOf(this, new.target.prototype);

        // Capture the stack trace for debugging purposes
        Error.captureStackTrace(this, this.constructor);
    }
}

