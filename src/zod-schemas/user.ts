import { z } from "zod";
import { MongooseObjectIdSchema, TimeStampSchema } from "./common";

export const UserSchema = z.object({
    _id: MongooseObjectIdSchema,
    googleId: z.string(),
    name: z.string().optional(),
    email: z.string().email(),
    accessToken: z.string().optional()
}).extend(TimeStampSchema.shape)
