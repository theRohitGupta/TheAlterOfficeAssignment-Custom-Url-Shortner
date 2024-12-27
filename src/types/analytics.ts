import { z } from "zod";
import { DeviceTypeEnum } from "../constants/enums/device-type";
import { OsTypeEnum } from "../constants/enums/os-type";
import { GetAliasAnalyticsRequestSchema, GetTopicBasedAnalyticsRequestSchema } from "../zod-schemas/analytics";

export type TGetCustomAliasAnalyticsRequest = z.infer<typeof GetAliasAnalyticsRequestSchema>

export type TGetTopicBasedAnalyticsRequest = z.infer<typeof GetTopicBasedAnalyticsRequestSchema>

export type TClicksByDate = {
    date: string| Date,
    clickCount: number
}

export type TOsType = {
    osName: OsTypeEnum | string,
    uniqueClicks: number,
    uniqueUsers: number
}

export type TDeviceType = {
    deviceName: DeviceTypeEnum | string,
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