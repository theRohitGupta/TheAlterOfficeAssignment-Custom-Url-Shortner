import { ShortUrlSchema } from "./short-url"

export const GetCustomAliasAnalyticsRequestSchema = ShortUrlSchema.pick({
    customAlias: true
}).required({
    customAlias: true
})

export const GetTopicBasedAnalyticsRequestSchema = ShortUrlSchema.pick({
    topic: true
}).required({
    topic: true
})