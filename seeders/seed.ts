
import sequelize from "../src/config/db";
// @ts-ignore
import { seedUsers } from "./userSeeder";

const runSeeder = async () => {
    try {
        await sequelize.sync({ force: false }); // optional: xóa bảng cũ
        await seedUsers();
        console.log("✅ All seeders done!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runSeeder();
//npx sequelize-cli seed:generate --name demo-user

//Chạy lệnh tạo ra seeder: npx ts-node seeders/seed.ts

