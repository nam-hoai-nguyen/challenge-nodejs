import path from 'path';
import { fileURLToPath } from 'url';

// Dùng biến thay thế thay vì __dirname / __filename
// @ts-ignore
const filename: string = fileURLToPath(import.meta.url);
const dirname: string = path.dirname(filename);

export default {
  config: path.resolve(dirname, 'config', 'config.js'),
  'models-path': path.resolve(dirname, 'models'),
  'seeders-path': path.resolve(dirname, 'seeders'),
  'migrations-path': path.resolve(dirname, 'migrations'),
};
