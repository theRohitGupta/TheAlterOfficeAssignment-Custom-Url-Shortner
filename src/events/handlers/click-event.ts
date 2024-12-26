import { Request } from "express";
import geoip from "geoip-lite"; // For GeoLocation extraction based on IP
import { ClickEventModel } from "../../models/click-event";
import { TShortUrl } from "../../types/short-url";
import { DeviceTypeEnum } from "../../constants/enums/device-type";
import { OsTypeEnum } from "../../constants/enums/os-type";

export const clickEventHandler = async (
  req: Request,
  shortUrlData: TShortUrl
) => {
  try {
    const timestamp = new Date(); // Capture the current timestamp
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress; // Get IP address
    const userAgent = req.headers["user-agent"]; // Extract User-Agent header

    // Simulated extraction of device and OS type based on user-agent
    const deviceType = /mobile/i.test(userAgent || "")
      ? DeviceTypeEnum.Mobile
      : /tablet/i.test(userAgent || "")
      ? DeviceTypeEnum.Tablet
      : /smart-tv|smarttv|appletv|hbbtv|googletv/i.test(userAgent || "")
      ? DeviceTypeEnum.SmartTV
      : /bot|crawl|spider|slurp|facebookexternalhit/i.test(userAgent || "")
      ? DeviceTypeEnum.Bot
      : DeviceTypeEnum.Desktop;

    const osType = /windows/i.test(userAgent || "")
      ? OsTypeEnum.Windows
      : /macintosh|mac os x/i.test(userAgent || "")
      ? OsTypeEnum.MacOS
      : /linux/i.test(userAgent || "")
      ? OsTypeEnum.Linux
      : /android/i.test(userAgent || "")
      ? OsTypeEnum.Android
      : /iphone|ipad|ipod/i.test(userAgent || "")
      ? OsTypeEnum.Ios
      : OsTypeEnum.Other;

    // GeoLocation extraction using geoip-lite
    const geoLocation = geoip.lookup(ipAddress as string);

    const clickEvent = new ClickEventModel({
      shortUrlId: shortUrlData._id,
      userId: shortUrlData.userId,
      timestamp,
      ipAddress,
      userAgent,
      deviceType,
      osType,
      geoLocation,
    });

    await clickEvent.save(); // Save the click event to the database
  } catch (error) {
    console.error("Error handling click event:", error);
  }
};
