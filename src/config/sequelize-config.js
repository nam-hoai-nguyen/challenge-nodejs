require('dotenv/config');

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
};
