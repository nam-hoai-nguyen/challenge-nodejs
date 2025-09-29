// @ts-ignore
import sequelize from '../config/db';
// @ts-ignore
import { seedUsers } from './userSeeder';

const runSeeder = async () => {
  try {
    await sequelize.sync({ force: false });
    await seedUsers();
    console.log('✅ All seeders done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runSeeder();
