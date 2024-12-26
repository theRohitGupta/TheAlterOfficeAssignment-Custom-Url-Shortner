import { z } from "zod";
import { GetCustomAliasAnalyticsRequestSchema, GetTopicBasedAnalyticsRequestSchema } from "../zod-schemas/analytics";
import { OsTypeEnum } from "../constants/enums/os-type";
import { DeviceTypeEnum } from "../constants/enums/device-type";

export type TGetCustomAliasAnalyticsRequest = z.infer<typeof GetCustomAliasAnalyticsRequestSchema>

export type TGetTopicBasedAnalyticsRequest = z.infer<typeof GetTopicBasedAnalyticsRequestSchema>

export type TClicksByDate = {
    date: string| Date,
    clickCount: number
}

export type TOsType = {
    osName: OsTypeEnum,
    uniqueClicks: number,
    uniqueUsers: number
}

export type TDeviceType = {
    deviceName: DeviceTypeEnum,
    uniqueClicks: number,
    uniqueUsers: number
}

export type TUrls = {
    shortUrl: string,
    totalClicks: number,
    uniqueUsers: number
}

export type TGetAnalyticsResponse = {
    totalUrls?: number,
    totalClicks?: number,
    clicksByDate?: TClicksByDate[],
    uniqueUsers?: number,
    osType?: TOsType[],
    deviceType?: TDeviceType[],
    urls?: TUrls[]
}