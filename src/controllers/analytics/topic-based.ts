import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import { TGetTopicBasedAnalyticsRequest } from "../../types/analytics";
import { validateSchema } from "../../utils/validate-schema";
import { GetTopicBasedAnalyticsRequestSchema } from "../../zod-schemas/analytics";
import { TRequestUser } from "../../types/req-user";

export const getTopicAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationData = validateSchema<TGetTopicBasedAnalyticsRequest>(GetTopicBasedAnalyticsRequestSchema, req.params);

        const topicAnalyticsForThisAlias = await clickEventService.topicAnalytics(validationData.topic, req.user as TRequestUser)

        return successHandler(res, {
            status: 200,
            data: topicAnalyticsForThisAlias
        }) 
    } catch (err) {
        next(err);
    }
};