import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { Sequelize, DataTypes } from 'sequelize';
import configFile from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = (configFile as any)[env];

const db: any = {};

let sequelize: Sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load tất cả models trong thư mục `models`
fs.readdirSync(__dirname)
    .filter(
        (file) =>
            file.indexOf('.') !== 0 &&
            file !== basename &&
            (file.endsWith('.ts') || file.endsWith('.js')) &&
            !file.endsWith('.test.ts') &&
            !file.endsWith('.test.js')
    )
    .forEach((file) => {
      const modelModule = require(path.join(__dirname, file));
      const model = modelModule.default
          ? modelModule.default(sequelize, DataTypes)
          : modelModule(sequelize, DataTypes);

      db[model.name] = model;
    });

// Setup quan hệ giữa các model nếu có
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
