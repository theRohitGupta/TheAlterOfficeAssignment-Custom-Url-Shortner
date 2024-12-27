import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import { TRequestUser } from "../../types/req-user";

export const getOverallAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const overallAnalyticsForThisAlias = await clickEventService.overallAnalytics(req.user as TRequestUser)

        return successHandler(res, {
            status: 200,
            data: overallAnalyticsForThisAlias
        }) 
    } catch (err) {
        next(err);
    }
};