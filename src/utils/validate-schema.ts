import { ZodSchema } from "zod";
import { AppError } from "./app-error";


// Common validation function
export const validateSchema = <T>(schema: ZodSchema<T>, data: unknown) => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
        throw new AppError('DATA_VALIDATION_ERROR', 404, validationResult.error);
    }
    return validationResult.data;
};
