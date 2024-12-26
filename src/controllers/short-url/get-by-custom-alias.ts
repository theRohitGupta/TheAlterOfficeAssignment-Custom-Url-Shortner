import { NextFunction, Request, Response } from "express";
import { shortUrlService } from "../../services/short-url";
import { TGetShortUrlFromCustomAliasRequest } from "../../types/short-url";
import { validateSchema } from "../../utils/validate-schema";
import { GetShortUrlByCustomAliasSchema } from "../../zod-schemas/short-url";
import { AppError } from "../../utils/app-error";
import { eventEmitter, EventNamesEnum } from "../../events";

export const getShortUrlByCustomAlias = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validationData = validateSchema<TGetShortUrlFromCustomAliasRequest>(GetShortUrlByCustomAliasSchema, req.params);
        
        const createdDoc = await shortUrlService.model.findOne(validationData)

        if(!createdDoc) {
            throw new AppError('Short URL not found', 404);
        }

        eventEmitter.emit(EventNamesEnum.CLICK_SHORT_URL_EVENT, req, createdDoc); // Emit the event

        return res.redirect(302, createdDoc.longUrl); // Redirect to the long URL
    } catch (err) {
        next(err);
    }
};