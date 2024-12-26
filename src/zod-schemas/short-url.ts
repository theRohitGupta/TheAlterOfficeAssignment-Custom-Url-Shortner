import { custom, z } from "zod";
import { ShortUrlTopicEnum } from "../constants/enums/topic";
import { MongooseObjectIdSchema, TimeStampSchema } from "./common";
import { UserSchema } from "./user";

export const ShortUrlSchema = z.object({
    _id: MongooseObjectIdSchema,
    userId: MongooseObjectIdSchema,
    longUrl: z.string(),
    customAlias: z.string().optional(),
    isCustom: z.boolean().optional(),
    topic: z.nativeEnum(ShortUrlTopicEnum).optional(),

    // VIRTUALS
    user: UserSchema.optional()
}).extend(TimeStampSchema.shape)