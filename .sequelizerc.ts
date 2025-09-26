import path from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

export default {
  config: path.resolve(dirname, 'config', 'config.js'),
  'models-path': path.resolve(dirname, 'models'),
  'seeders-path': path.resolve(dirname, 'seeders'),
  'migrations-path': path.resolve(dirname, 'migrations'),
};
