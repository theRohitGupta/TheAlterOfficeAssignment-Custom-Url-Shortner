import { faker } from '@faker-js/faker';
import { ShortUrlTopicEnum } from "../constants/enums/topic";
import { shortUrlService } from '../services/short-url';
import UserModel from '../models/user';

export const seedShortUrls = async (count: number) => {
    try{
        const shortUrls = [];

        const allUsers = await UserModel.find({}, '_id');
        const genratedAliases = new Set<string>();

        while(genratedAliases.size < count){
            genratedAliases.add(faker.lorem.word());
        }

        for (let i = 0; i < count; i++) {
            shortUrls.push({
                userId: faker.helpers.arrayElement(allUsers),
                longUrl: faker.internet.url(),
                alias: Array.from(genratedAliases)[i],
                isCustom: faker.datatype.boolean(),
                topic: faker.helpers.arrayElement(Object.values(ShortUrlTopicEnum)),
                createdAt: faker.date.past(),
                updatedAt: faker.date.recent()
            });
        }
    
        await shortUrlService.model.insertMany(shortUrls);
        console.log("Short Urls Seed data inserted successfully");
    }catch(error){
        console.error('Error seeding shortUrls:', error);
    }
}