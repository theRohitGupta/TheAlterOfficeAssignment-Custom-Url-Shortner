import { z } from "zod";
import { CreateShortUrlSchema, GetShortUrlByCustomAliasSchema, ShortUrlSchema } from "../zod-schemas/short-url";

export type TShortUrl = z.infer<typeof ShortUrlSchema>

export type TCreateShortUrlRequest = z.infer<typeof CreateShortUrlSchema>

export type TGetShortUrlFromCustomAliasRequest = z.infer<typeof GetShortUrlByCustomAliasSchema>
