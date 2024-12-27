import { NextFunction, Request, Response } from "express";
import { successHandler } from "../../middleware/success-handler";
import { clickEventService } from "../../services/analytics";
import { TGetCustomAliasAnalyticsRequest } from "../../types/analytics";
import { validateSchema } from "../../utils/validate-schema";
import { GetAliasAnalyticsRequestSchema } from "../../zod-schemas/analytics";
import { TRequestUser } from "../../types/req-user";

export const getUrlAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationData = validateSchema<TGetCustomAliasAnalyticsRequest>(GetAliasAnalyticsRequestSchema, req.params);

        const urlAnalyticsForThisAlias = await clickEventService.aliasAnalytics(validationData.alias, req.user as TRequestUser)

        return successHandler(res, {
            status: 200,
            data: urlAnalyticsForThisAlias
        }) 
    } catch (err) {
        next(err);
    }
};