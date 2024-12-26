import { NextFunction, Request, Response } from "express";
import { PORT } from "../../constants/variables/env-constants";
import { successHandler } from "../../middleware/success-handler";
import { shortUrlService } from "../../services/short-url";
import { TCreateShortUrlRequest } from "../../types/short-url";
import { validateSchema } from "../../utils/validate-schema";
import { CreateShortUrlSchema } from "../../zod-schemas/short-url";
import { TRequestUser } from "../../types/req-user";

export const createShortUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = {
            ...req.body,
            userId: (req.user as TRequestUser)._id.toString()
        }
        const validationData = validateSchema<TCreateShortUrlRequest>(CreateShortUrlSchema, data);
        
        const createdDoc = await shortUrlService.createShortUrl(validationData)

        return successHandler(res, {
            status: 201,
            data: {
                shortUrl: `http://localhost:${PORT}/api/shorten/${createdDoc.customAlias}`,
                createdAt: createdDoc.createdAt
            }
        })

    } catch (err) {
        next(err);
    }
};