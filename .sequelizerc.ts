import path from 'path';
import { fileURLToPath } from 'url';

// @ts-expect-error
const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

export default {
  config: path.resolve(dirname, 'config', 'src/config/db.ts'),
  'models-path': path.resolve(dirname, 'src/infrastructure/db/sequelize/models'),
  'seeders-path': path.resolve(dirname, 'seeders'),
  'migrations-path': path.resolve(dirname, 'migrations'),
};
