import { z } from "zod";

export const ObjectIdRegex = /^[a-fA-F0-9]{24}$/;

export const MongooseObjectIdSchema = z.string().refine((value) => ObjectIdRegex.test(value), {
    message: "Invalid ObjectId format"
});

export const TimeStampSchema = z.object({
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
})