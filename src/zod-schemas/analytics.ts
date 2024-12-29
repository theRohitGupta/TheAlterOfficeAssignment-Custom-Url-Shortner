import { z } from "zod"
import { ShortUrlTopicEnum } from "../constants/enums/topic"

export const GetAliasAnalyticsRequestSchema = z.object({
    alias: z.string()
})

export const GetTopicBasedAnalyticsRequestSchema = z.object({
    topic: z.nativeEnum(ShortUrlTopicEnum)
})