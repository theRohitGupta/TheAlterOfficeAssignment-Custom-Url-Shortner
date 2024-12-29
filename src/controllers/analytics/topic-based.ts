import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import {
  TGetAnalyticsResponse,
  TGetTopicBasedAnalyticsRequest,
} from "../../types/analytics";
import { validateSchema } from "../../utils/validate-schema";
import { GetTopicBasedAnalyticsRequestSchema } from "../../zod-schemas/analytics";
import { TRequestUser } from "../../types/req-user";
import RedisClient from "../../config/redis";

export const getTopicAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validationData = validateSchema<TGetTopicBasedAnalyticsRequest>(
      GetTopicBasedAnalyticsRequestSchema,
      req.params
    );
    const user = req.user as TRequestUser;
    const cacheKey = `${validationData.topic}-${user._id.toString()}`;

    // REDIS CACHED DATA
    let topicAnalytics = await RedisClient.get<TGetAnalyticsResponse>(cacheKey);

    if (!topicAnalytics) {
      topicAnalytics = await clickEventService.topicAnalytics(
        validationData.topic,
        user
      );
    }

    // REDIS CACHING CODE
    RedisClient.setWithExpiry(cacheKey, topicAnalytics, 5 * 60);

    return successHandler(res, {
      status: 200,
      data: topicAnalytics,
    });
  } catch (err) {
    next(err);
  }
};
