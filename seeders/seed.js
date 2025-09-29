"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const db_1 = __importDefault(require("../config/db"));
// @ts-ignore
const userSeeder_1 = require("./userSeeder");
const runSeeder = async () => {
    try {
        await db_1.default.sync({ force: false });
        await (0, userSeeder_1.seedUsers)();
        console.log('✅ All seeders done!');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
runSeeder();
