"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const faker_1 = require("@faker-js/faker");
const UserModel_1 = __importDefault(require("../src/infrastructure/db/sequelize/models/UserModel"));
const seedUsers = async () => {
    const users = [];
    for (let i = 0; i < 10; i++) {
        users.push({
            name: faker_1.faker.person.fullName(),
            email: faker_1.faker.internet.email(),
            password: faker_1.faker.internet.password({ length: 8 }),
            role: 'employee',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
    await UserModel_1.default.bulkCreate(users, { ignoreDuplicates: true });
    console.log('✅ Seeded 10 users successfully!');
};
exports.seedUsers = seedUsers;
