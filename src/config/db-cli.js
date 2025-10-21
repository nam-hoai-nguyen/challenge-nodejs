// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  },
};
