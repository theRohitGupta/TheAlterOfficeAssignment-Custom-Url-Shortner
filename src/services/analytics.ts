import { Model, Types } from "mongoose";
import { ShortUrlTopicEnum } from "../constants/enums/topic";
import { ClickEventModel, IClickEventDocument } from "../models/click-event";
import { TGetAnalyticsResponse } from "../types/analytics";
import { AppError } from "../utils/app-error";
import { shortUrlService } from "./short-url";
import { TRequestUser } from "../types/req-user";

// Unique clicks refer to the total number of distinct clicks on a link, regardless of the user.
// Unique users represent the number of distinct individuals who clicked the link, which may be fewer
// if some users click multiple times.

// unique clicks means diffrent ips
// unique users means diffrent users

/**
 * Service to handle short URL operations.
 */
class ClickEventService {
  model: Model<IClickEventDocument>;

  constructor(model: Model<IClickEventDocument>) {
    this.model = model;
  }

  public async aliasAnalytics(alias: string, user: TRequestUser): Promise<TGetAnalyticsResponse> {
    const aliasAnalytics: TGetAnalyticsResponse = {
      totalClicks: 0,
      uniqueUsers: 0,
      clicksByDate: [],
      osType: [],
      deviceType: [],
    };

    const shortUrlDocument = await shortUrlService.model.findOne({
      alias: alias,
    });

    if (!shortUrlDocument) {
      throw new AppError("Alias not found", 404);
    }

    if(shortUrlDocument.userId.toString() !== user._id.toString()){
      throw new AppError("You are not the Owner of this Alias", 401)
    }

    const allClickEventDocsForThisAlias = await this.model.find({
      shortUrlId: shortUrlDocument._id,
    });

    // TOTAL CLICKS
    aliasAnalytics.totalClicks = allClickEventDocsForThisAlias.length;

    // UNIQUE USERS
    const uniqueUsers = new Set<string | Types.ObjectId>();
    allClickEventDocsForThisAlias.forEach((doc) => {
      if (doc.userId) uniqueUsers.add(doc.userId);
    });

    aliasAnalytics.uniqueUsers = uniqueUsers.size;

    // CLICKS BY DATE
    const allClickDocumentsInLast7Days = allClickEventDocsForThisAlias.filter(
      (doc) => doc.timestamp >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const clicksByDateMap: { [key: string]: number } = {};
    allClickDocumentsInLast7Days.forEach((doc) => {
      const date = doc.timestamp.toISOString().split("T")[0];
      clicksByDateMap[date] = (clicksByDateMap[date] || 0) + 1;
    });

    // OS TYPE
    const osTypeMap: {
      [key: string]: {
        uniqueClicks: Set<string | Types.ObjectId>;
        uniqueUsers: Set<string | Types.ObjectId>;
      };
    } = {};
    const deviceTypeMap: {
      [key: string]: {
        uniqueClicks: Set<string | Types.ObjectId>;
        uniqueUsers: Set<string | Types.ObjectId>;
      };
    } = {};

    allClickEventDocsForThisAlias.forEach((doc) => {
      if (!osTypeMap[doc.osType]) {
        osTypeMap[doc.osType] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      osTypeMap[doc.osType].uniqueClicks.add(doc.ipAddress);
      if(doc.userId) osTypeMap[doc.osType].uniqueUsers.add(doc.userId);

      if (!deviceTypeMap[doc.deviceType]) {
        deviceTypeMap[doc.deviceType] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      deviceTypeMap[doc.deviceType].uniqueClicks.add(doc.ipAddress);
      if(doc.userId) deviceTypeMap[doc.deviceType].uniqueUsers.add(doc.userId);
    });

    aliasAnalytics.clicksByDate = Object.keys(clicksByDateMap).map((date) => ({
      date,
      clickCount: clicksByDateMap[date],
    }));

    aliasAnalytics.osType = Object.keys(osTypeMap).map((osName) => ({
      osName,
      uniqueClicks: osTypeMap[osName].uniqueClicks.size,
      uniqueUsers: osTypeMap[osName].uniqueUsers.size,
    }));

    aliasAnalytics.deviceType = Object.keys(deviceTypeMap).map(
      (deviceName) => ({
        deviceName,
        uniqueClicks: deviceTypeMap[deviceName].uniqueClicks.size,
        uniqueUsers: deviceTypeMap[deviceName].uniqueUsers.size,
      })
    );

    return aliasAnalytics;
  }

  public async topicAnalytics(topic: ShortUrlTopicEnum, user: TRequestUser): Promise<TGetAnalyticsResponse> {
    const userId = user?._id
    const shortUrlDocuments = await shortUrlService.model.find({ topic, userId });

    if (!shortUrlDocuments.length) {
      throw new AppError("No URLs found for the specified topic", 404);
    }

    const shortUrlIds = shortUrlDocuments.map(doc => doc._id);
    const allClickEventDocsForThisTopic = await this.model.find({
      shortUrlId: { $in: shortUrlIds }
    });

    // Total clicks
    const totalClicks = allClickEventDocsForThisTopic.length;

    // Unique users
    const uniqueUsers = new Set(
      allClickEventDocsForThisTopic
        .filter(doc => doc.userId)
        .map(doc => doc.userId && doc.userId.toString())
    );

    // Clicks by date
    const clicksByDateMap: { [key: string]: number } = {};
    allClickEventDocsForThisTopic.forEach(doc => {
      const date = doc.timestamp.toISOString().split("T")[0];
      clicksByDateMap[date] = (clicksByDateMap[date] || 0) + 1;
    });

    const clicksByDate = Object.entries(clicksByDateMap)
      .map(([date, clickCount]) => ({ date, clickCount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // URLs analytics
    const urls = shortUrlDocuments.map(shortUrlDoc => {
      const urlClickEvents = allClickEventDocsForThisTopic.filter(
        doc => doc.shortUrlId.toString() === shortUrlDoc._id.toString()
      );

      const urlUniqueUsers = new Set(
        urlClickEvents
          .filter(doc => doc.userId)
          .map(doc => doc.userId && doc.userId.toString())
      );

      return {
        shortUrl: shortUrlDoc.alias,
        totalClicks: urlClickEvents.length,
        uniqueUsers: urlUniqueUsers.size,
      };
    });

    return {
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      clicksByDate,
      urls,
    };
  }

  public async overallAnalytics(user: TRequestUser): Promise<TGetAnalyticsResponse> {
    const userId = user?._id;
    const shortUrlDocuments = await shortUrlService.model.find({ userId });

    if (!shortUrlDocuments.length) {
      throw new AppError("No URLs found for the user", 404);
    }

    const shortUrlIds = shortUrlDocuments.map(doc => doc._id);
    const allClickEventDocs = await this.model.find({
      shortUrlId: { $in: shortUrlIds }
    });

    // Total URLs
    const totalUrls = shortUrlDocuments.length;

    // Total clicks
    const totalClicks = allClickEventDocs.length;

    // Unique users
    const uniqueUsers = new Set(
      allClickEventDocs
        .filter(doc => doc.userId)
        .map(doc => doc.userId && doc.userId.toString())
    );

    // Clicks by date
    const clicksByDateMap: { [key: string]: number } = {};
    allClickEventDocs.forEach(doc => {
      const date = doc.timestamp.toISOString().split("T")[0];
      clicksByDateMap[date] = (clicksByDateMap[date] || 0) + 1;
    });

    const clicksByDate = Object.entries(clicksByDateMap)
      .map(([date, clickCount]) => ({ date, clickCount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // OS Type
    const osTypeMap: {
      [key: string]: {
        uniqueClicks: Set<string | Types.ObjectId>;
        uniqueUsers: Set<string | Types.ObjectId>;
      };
    } = {};

    const deviceTypeMap: {
      [key: string]: {
        uniqueClicks: Set<string | Types.ObjectId>;
        uniqueUsers: Set<string | Types.ObjectId>;
      };
    } = {};

    allClickEventDocs.forEach(doc => {
      if (!osTypeMap[doc.osType]) {
        osTypeMap[doc.osType] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      osTypeMap[doc.osType].uniqueClicks.add(doc.ipAddress);
      if (doc.userId) osTypeMap[doc.osType].uniqueUsers.add(doc.userId);

      if (!deviceTypeMap[doc.deviceType]) {
        deviceTypeMap[doc.deviceType] = {
          uniqueClicks: new Set(),
          uniqueUsers: new Set(),
        };
      }
      deviceTypeMap[doc.deviceType].uniqueClicks.add(doc.ipAddress);
      if (doc.userId) deviceTypeMap[doc.deviceType].uniqueUsers.add(doc.userId);
    });

    const osType = Object.keys(osTypeMap).map(osName => ({
      osName,
      uniqueClicks: osTypeMap[osName].uniqueClicks.size,
      uniqueUsers: osTypeMap[osName].uniqueUsers.size,
    }));

    const deviceType = Object.keys(deviceTypeMap).map(deviceName => ({
      deviceName,
      uniqueClicks: deviceTypeMap[deviceName].uniqueClicks.size,
      uniqueUsers: deviceTypeMap[deviceName].uniqueUsers.size,
    }));

    return {
      totalUrls,
      totalClicks,
      uniqueUsers: uniqueUsers.size,
      clicksByDate,
      osType,
      deviceType,
    };
  }
}

export const clickEventService = new ClickEventService(ClickEventModel);
