import { faker } from '@faker-js/faker';
import UserModel from '../models/user';

export const seedUsers = async (count: number) => {
    try {
        const users = Array.from({ length: count }).map(() => ({
            googleId: faker.string.uuid(),
            email: faker.internet.email(),
            name: faker.person.fullName(),
            accessToken: faker.internet.password(),
        }));

        await UserModel.insertMany(users);
        console.log(count,' users have been successfully seeded.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};