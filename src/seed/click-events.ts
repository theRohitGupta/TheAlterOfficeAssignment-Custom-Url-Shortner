import { Types } from 'mongoose';
import { faker } from '@faker-js/faker';
import { clickEventService } from '../services/analytics';
import { DeviceTypeEnum } from '../constants/enums/device-type';
import { OsTypeEnum } from '../constants/enums/os-type';
import { shortUrlService } from '../services/short-url';
import UserModel from '../models/user';

export const seedClickEvents = async (numEvents: number) => {
    try{
        const clickEvents = [];

        const shortUrlIds = await shortUrlService.model.find({}, '_id');
        const userIds = await UserModel.find({}, '_id');

        for (let i = 0; i < numEvents; i++) {
            const clickEvent = {
                shortUrlId: faker.helpers.arrayElement(shortUrlIds),
                userId: Math.random() > 0.5 ? faker.helpers.arrayElement(userIds) : undefined,
                timestamp: faker.date.recent(),
                ipAddress: faker.internet.ip(),
                userAgent: faker.internet.userAgent(),
                deviceType: faker.helpers.arrayElement(Object.keys(DeviceTypeEnum)),
                osType: faker.helpers.arrayElement(Object.keys(OsTypeEnum)),
                geoLocation: {
                    country: faker.location.country(),
                    city: faker.location.city(),
                    latitude: faker.location.latitude(),
                    longitude: faker.location.longitude(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };
    
            clickEvents.push(clickEvent);
        }
    
        await clickEventService.model.insertMany(clickEvents);
        console.log(`${numEvents} fake click events generated and inserted into the database.`);
    }catch(error){
        console.error('Error seeding ClickEvents:', error);
    }
};