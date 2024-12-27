import { Document, model, Schema, Types } from "mongoose";
import { ModelsEnum } from "../constants/enums/models";
import { ShortUrlTopicEnum } from "../constants/enums/topic";
import { IUserDocument } from "./user";

export interface IShortUrlDocument extends Document {
    _id: Types.ObjectId | string;
    userId: Types.ObjectId | string;
    longUrl: string;
    alias: string;
    isCustom: boolean;
    topic?: ShortUrlTopicEnum;
    createdAt: Date;
    updatedAt: Date;
    
    // Virtual fields
    user?: IUserDocument;
}

const ShortUrlSchema = new Schema<IShortUrlDocument>(
    {
        userId: { type: Schema.Types.ObjectId, ref: ModelsEnum.USER, required: true },
        longUrl: { type: String, required: true },
        alias: { type: String, required: true, unique: true },
        isCustom: { type: Boolean, required: true },
        topic: {
            type: String,
            enum: Object.values(ShortUrlTopicEnum)
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes
ShortUrlSchema.index({ alias: 1 });

// Virtual fields
ShortUrlSchema.virtual('user', {
    ref: ModelsEnum.USER,
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

export const ShortUrlModel = model<IShortUrlDocument>(ModelsEnum.SHORT_URL, ShortUrlSchema);