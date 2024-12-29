import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import { TRequestUser } from "../../types/req-user";
import RedisClient from "../../config/redis";
import { TGetAnalyticsResponse } from "../../types/analytics";

export const getOverallAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as TRequestUser
    const cacheKey = `overall-${user._id}`

    // REDIS CACHED DATA
    let overallAnalytics = await RedisClient.get<TGetAnalyticsResponse>(cacheKey);

    if(!overallAnalytics) {
        overallAnalytics = await clickEventService.overallAnalytics(user);
    }

    // REDIS CACHING CODE
    RedisClient.setWithExpiry(cacheKey, overallAnalytics, 5 * 60);

    return successHandler(res, {
      status: 200,
      data: overallAnalytics,
    });
  } catch (err) {
    next(err);
  }
};
