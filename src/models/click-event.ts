import { model, Schema, Types } from 'mongoose';
import { ModelsEnum } from '../constants/enums/models';
import { Document } from 'mongoose';

export interface IClickEventDocument extends Document {
  _id: Types.ObjectId | string;
  shortUrlId: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  osType: string;
  geoLocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ClickEventSchema = new Schema<IClickEventDocument>(
  {
    shortUrlId: { type: Schema.Types.ObjectId, required: true },
    userId: { type: Schema.Types.ObjectId },
    timestamp: { type: Date },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String },
    osType: { type: String},
    geoLocation: {
      country: String,
      city: String,
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
ClickEventSchema.index({ shortUrlId: 1, timestamp: -1 });
ClickEventSchema.index({ shortUrlId: 1, ipAddress: 1 });
ClickEventSchema.index({ userId: 1 });

export const ClickEventModel = model<IClickEventDocument>(
  ModelsEnum.CLICK_EVENT,
  ClickEventSchema,
);
