import { faker } from "@faker-js/faker";
import User from "../src/infrastructure/db/sequelize/models/User";

export const seedUsers = async () => {
    const users = [];

    for (let i = 0; i < 10; i++) {
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 8 }),
            role: "employee",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    await User.bulkCreate(users, { ignoreDuplicates: true });
    console.log("✅ Seeded 10 users successfully!");
};
