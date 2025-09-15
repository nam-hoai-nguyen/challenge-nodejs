import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes, Model, ModelCtor } from 'sequelize';
// @ts-ignore
import configFile from '../config/config';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

type DBConfig = {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  use_env_variable?: string;
};

const config: DBConfig = (configFile as Record<string, DBConfig>)[env];

// Dùng `object` thay cho `any` để gọn hơn và tránh warning
interface ModelWithAssociate extends ModelCtor<Model<object, object>> {
  associate?: (db: DB) => void;
}

interface DB {
  [key: string]: ModelWithAssociate | Sequelize;
  sequelize: Sequelize;
  // @ts-ignore
  Sequelize: typeof Sequelize;
}

const db: DB = {} as DB;

let sequelize: Sequelize;

if (config.use_env_variable) {
  // @ts-ignore
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  // @ts-ignore
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

for (const file of fs.readdirSync(__dirname)) {
  if (
    file.indexOf('.') === 0 ||
    file === basename ||
    (!file.endsWith('.ts') && !file.endsWith('.js')) ||
    file.endsWith('.test.ts') ||
    file.endsWith('.test.js')
  ) {
    continue;
  }

  // @ts-ignore
  const modelModule = await import(pathToFileURL(path.join(__dirname, file)).href);
  const model = modelModule.default
    ? modelModule.default(sequelize, DataTypes)
    : modelModule(sequelize, DataTypes);

  db[model.name] = model as ModelWithAssociate;
}

for (const modelName of Object.keys(db)) {
  const model = db[modelName] as ModelWithAssociate;
  if (model.associate) {
    model.associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
