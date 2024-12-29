import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import {
  TGetAnalyticsResponse,
  TGetCustomAliasAnalyticsRequest,
} from "../../types/analytics";
import { validateSchema } from "../../utils/validate-schema";
import { GetAliasAnalyticsRequestSchema } from "../../zod-schemas/analytics";
import { TRequestUser } from "../../types/req-user";
import RedisClient from "../../config/redis";

export const getUrlAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationData = validateSchema<TGetCustomAliasAnalyticsRequest>(
      GetAliasAnalyticsRequestSchema,
      req.params
    );

    const user = req.user as TRequestUser;
    const cacheKey = `${validationData.alias}-${user._id.toString()}`;

    // REDIS CACHED DATA
    let urlAnalyticsForThisAlias = await RedisClient.get<TGetAnalyticsResponse>(cacheKey);

    if(!urlAnalyticsForThisAlias){
        urlAnalyticsForThisAlias = await clickEventService.aliasAnalytics(
            validationData.alias,
            user
          );
    }

    // REDIS CACHING CODE
    RedisClient.setWithExpiry(cacheKey, urlAnalyticsForThisAlias, 5 * 60);

    return successHandler(res, {
      status: 200,
      data: urlAnalyticsForThisAlias,
    });
  } catch (err) {
    next(err);
  }
};
