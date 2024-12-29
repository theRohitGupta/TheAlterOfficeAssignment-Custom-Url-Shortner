import { NextFunction, Request, Response } from "express";
import RedisClient from "../../config/redis";
import { eventEmitter } from "../../events";
import { shortUrlService } from "../../services/short-url";
import { TGetShortUrlFromCustomAliasRequest, TShortUrl } from "../../types/short-url";
import { AppError } from "../../utils/app-error";
import { validateSchema } from "../../utils/validate-schema";
import { GetShortUrlByCustomAliasSchema } from "../../zod-schemas/short-url";
import { EventNamesEnum } from "../../constants/enums/event-names";

export const getShortUrlByCustomAlias = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationData = validateSchema<TGetShortUrlFromCustomAliasRequest>(
      GetShortUrlByCustomAliasSchema,
      req.params
    );
    const cacheKey = validationData.alias

    // REDIS CACHED DATA
    let aliasData = await RedisClient.get<TShortUrl>(cacheKey)

    if(!aliasData){
        aliasData = await shortUrlService.model.findOne(validationData);

        if (!aliasData) {
          throw new AppError("Short URL not found", 404);
        }
    }

    eventEmitter.emit(EventNamesEnum.CLICK_SHORT_URL_EVENT, req, aliasData); // Emit the event

    // REDIS CACHING CODE
    RedisClient.setWithExpiry(cacheKey, aliasData, 24 * 60 * 60);

    return res.redirect(302, aliasData.longUrl); // Redirect to the long URL
  } catch (err) {
    next(err);
  }
};
