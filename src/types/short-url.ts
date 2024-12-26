import { z } from "zod";
import { ShortUrlSchema } from "../zod-schemas/short-url";

export type TShortUrl = z.infer<typeof ShortUrlSchema>