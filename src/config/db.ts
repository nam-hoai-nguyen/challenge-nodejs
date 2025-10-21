import { Sequelize } from 'sequelize';

// Vì sequelize-config dùng export = => phải require
// eslint-disable-next-line @typescript-eslint/no-require-imports
const allConfig = require('./sequelize-config') as {
  [env: string]: {
    username: string;
    password: string;
    database: string;
    host: string;
    dialect: any;
    logging: boolean | ((sql: string) => void);
  };
};

const env = process.env.NODE_ENV || 'development';
const cfg = allConfig[env];

if (!cfg) {
  throw new Error(`Database config for env "${env}" not found`);
}

export const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, {
  host: cfg.host,
  dialect: cfg.dialect,
  logging: cfg.logging,
});

export default sequelize;
