import * as fs from 'fs';
import * as path from 'path';

interface ParsedField {
  name: string;
  type: string;
  allowNull: boolean;
  defaultValue?: string;
  unique?: boolean;
  index?: boolean;
}

const TYPE_MAP: Record<string, string> = {
  string: 'DataTypes.STRING',
  text: 'DataTypes.TEXT',
  int: 'DataTypes.INTEGER',
  bigint: 'DataTypes.BIGINT',
  float: 'DataTypes.FLOAT',
  double: 'DataTypes.DOUBLE',
  decimal: 'DataTypes.DECIMAL',
  boolean: 'DataTypes.BOOLEAN',
  date: 'DataTypes.DATE',
  datetime: 'DataTypes.DATE',
  json: 'DataTypes.JSON',
  uuid: 'DataTypes.UUID',
};

function pascalCase(str: string) {
  return str
    .replace(/[-_]+/g, ' ')
    .replace(/\s+([a-zA-Z])/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());
}

function pluralize(name: string) {
  // đơn giản: nếu kết thúc bằng 's' thì giữ nguyên
  if (name.endsWith('s')) return name.toLowerCase();
  return name.toLowerCase() + 's';
}

function timestamp() {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function parseField(raw: string): ParsedField {
  // Ví dụ raw: email:string:unique  hoặc age:int?=18  hoặc role:string='user'
  const original = raw.trim();
  if (!original) throw new Error('Empty field spec encountered');

  // Tách phần modifier set {...}
  let modifiers: string[] = [];
  let modMatch = original.match(/:(\{.*\})$/);
  let core = original;
  if (modMatch) {
    const modBlock = modMatch[1]; // {unique,index}
    core = original.slice(0, original.lastIndexOf(modBlock));
    modifiers = modBlock
      .replace(/^{|}$/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Bóc phần unique / index kiểu shorthand (:unique / :index)
  let shortMods: string[] = [];
  const shortModRegex = /:(unique|index)\b/g;
  let m;
  while ((m = shortModRegex.exec(core)) !== null) {
    shortMods.push(m[1]);
  }
  core = core.replace(/:(unique|index)\b/g, '');

  // Field = phần trước dấu ? hoặc =
  // pattern: name[:type][?][=default]
  const defaultMatch = core.match(/=([^:]+)$/);
  let defaultValue: string | undefined;
  if (defaultMatch) {
    defaultValue = defaultMatch[1].trim();
    core = core.slice(0, core.lastIndexOf('=' + defaultValue));
  }

  const isOptional = core.includes('?');
  core = core.replace('?', '');

  const parts = core.split(':').filter(Boolean);
  const fieldName = parts[0];
  const typeInput = parts[1] || 'string';

  const type = TYPE_MAP[typeInput.toLowerCase()] || 'DataTypes.STRING';

  const allMods = new Set([...modifiers, ...shortMods]);

  return {
    name: fieldName,
    type,
    allowNull: isOptional,
    defaultValue,
    unique: allMods.has('unique'),
    index: allMods.has('index'),
  };
}

function fieldAttributeLine(f: ParsedField) {
  const lines: string[] = [];
  lines.push(`${f.name}: {`);
  lines.push(`  type: ${f.type},`);
  if (!f.allowNull) lines.push(`  allowNull: false,`);
  else lines.push(`  allowNull: true,`);
  if (f.unique) lines.push(`  unique: true,`);
  if (f.defaultValue !== undefined) {
    // Thử đoán kiểu
    if (/^(true|false)$/i.test(f.defaultValue)) {
      lines.push(`  defaultValue: ${f.defaultValue.toLowerCase()},`);
    } else if (/^\d+(\.\d+)?$/.test(f.defaultValue)) {
      lines.push(`  defaultValue: ${f.defaultValue},`);
    } else if (/^'.*'$/.test(f.defaultValue) || /^".*"$/.test(f.defaultValue)) {
      lines.push(`  defaultValue: ${f.defaultValue},`);
    } else {
      // chuỗi không có quote => thêm quote
      lines.push(`  defaultValue: '${f.defaultValue}',`);
    }
  }
  lines.push(`},`);
  return lines.join('\n');
}

function buildMigration(entityName: string, fields: ParsedField[], tableName: string) {
  const lines: string[] = [];
  lines.push(`import { QueryInterface, DataTypes } from 'sequelize';`);
  lines.push('');
  lines.push(`export async function up(queryInterface: QueryInterface) {`);
  lines.push(`  await queryInterface.createTable('${tableName}', {`);
  lines.push(
    `    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true, allowNull: false },`,
  );
  for (const f of fields) {
    lines.push(
      `    ${f.name}: { type: ${f.type}, ${f.allowNull ? 'allowNull: true' : 'allowNull: false'}${
        f.unique ? ', unique: true' : ''
      }${
        f.defaultValue !== undefined
          ? `, defaultValue: ${
              /^(true|false|\d+(\.\d+)?|'.*'|".*")$/.test(f.defaultValue)
                ? f.defaultValue
                : `'${f.defaultValue}'`
            }`
          : ''
      } },`,
    );
  }
  lines.push(
    `    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },`,
  );
  lines.push(
    `    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },`,
  );
  lines.push(`  });`);

  // Thêm index nếu có
  const indexFields = fields.filter((f) => f.index);
  for (const f of indexFields) {
    lines.push(
      `  await queryInterface.addIndex('${tableName}', ['${f.name}'], { name: '${tableName}_${f.name}_idx' });`,
    );
  }

  lines.push(`}`);
  lines.push('');
  lines.push(`export async function down(queryInterface: QueryInterface) {`);
  lines.push(`  await queryInterface.dropTable('${tableName}');`);
  lines.push(`}`);
  lines.push('');
  lines.push(`export default { up, down };`);
  return lines.join('\n');
}

function buildModel(entityName: string, fields: ParsedField[], tableName: string) {
  const className = pascalCase(entityName) + 'Model';

  // Attributes interface
  const attrInterface: string[] = [];
  attrInterface.push(`interface ${pascalCase(entityName)}Attributes {`);
  attrInterface.push(`  id: number;`);
  for (const f of fields) {
    attrInterface.push(
      `  ${f.name}${f.allowNull ? '?:' : ':'} ${mapTsType(f.type)}${f.allowNull ? ' | null' : ''};`,
    );
  }
  attrInterface.push(`  created_at: Date;`);
  attrInterface.push(`  updated_at: Date;`);
  attrInterface.push(`}`);

  const creationExcludes = ['id', 'created_at', 'updated_at'].concat(
    fields.filter((f) => f.defaultValue !== undefined).map((f) => f.name),
  );

  const creationType = `type ${pascalCase(entityName)}Creation = Optional<${pascalCase(
    entityName,
  )}Attributes, '${creationExcludes.join("' | '")}'>;`;

  const lines: string[] = [];
  lines.push(`import { DataTypes, Model, Optional } from 'sequelize';`);
  lines.push(`import { sequelize } from '../../../../config/db';`);
  lines.push('');
  lines.push(attrInterface.join('\n'));
  lines.push(creationType);
  lines.push('');
  lines.push(
    `export class ${className} extends Model<${pascalCase(
      entityName,
    )}Attributes, ${pascalCase(entityName)}Creation> implements ${pascalCase(
      entityName,
    )}Attributes {`,
  );
  lines.push(`  public id!: number;`);
  for (const f of fields) {
    lines.push(`  public ${f.name}!: ${mapTsType(f.type)}${f.allowNull ? ' | null' : ''};`);
  }
  lines.push(`  public created_at!: Date;`);
  lines.push(`  public updated_at!: Date;`);
  lines.push(`}`);
  lines.push('');
  lines.push(`${className}.init({`);
  lines.push(`  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },`);
  for (const f of fields) {
    const attrs: string[] = [];
    attrs.push(`type: ${f.type}`);
    attrs.push(`allowNull: ${f.allowNull ? 'true' : 'false'}`);
    if (f.unique) attrs.push(`unique: true`);
    if (f.defaultValue !== undefined) {
      const val = /^(true|false|\d+(\.\d+)?|'.*'|".*")$/.test(f.defaultValue)
        ? f.defaultValue
        : `'${f.defaultValue}'`;
      attrs.push(`defaultValue: ${val}`);
    }
    lines.push(`  ${f.name}: { ${attrs.join(', ')} },`);
  }
  lines.push(
    `  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },`,
  );
  lines.push(
    `  updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },`,
  );
  lines.push(`}, {`);
  lines.push(`  sequelize,`);
  lines.push(`  tableName: '${tableName}',`);
  lines.push(`  timestamps: false,`);
  lines.push(`  underscored: true,`);
  lines.push(`});`);
  lines.push('');
  lines.push(`export default ${className};`);
  return lines.join('\n');
}

function mapTsType(sequelizeType: string): string {
  const map: Record<string, string> = {
    STRING: 'string',
    TEXT: 'string',
    INTEGER: 'number',
    BIGINT: 'number',
    FLOAT: 'number',
    DOUBLE: 'number',
    DECIMAL: 'string',
    BOOLEAN: 'boolean',
    DATE: 'Date',
    JSON: 'any',
    UUID: 'string',
  };
  for (const key of Object.keys(map)) {
    if (sequelizeType.includes(key)) return map[key];
  }
  return 'any';
}

// ---------------- MAIN ----------------
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'Usage: npm run generate:entity -- <entityName> [field[:type][?][=default][:{unique,index}] ...]',
    );
    process.exit(1);
  }

  const entityName = args[0];
  const rawFields = args.slice(1);

  const fields = rawFields.map(parseField);

  const migrationsDir = path.resolve(process.cwd(), 'migrations');
  const modelsDir = path.resolve(
    process.cwd(),
    'src',
    'infrastructure',
    'db',
    'sequelize',
    'models',
  );

  if (!fs.existsSync(migrationsDir)) fs.mkdirSync(migrationsDir, { recursive: true });
  if (!fs.existsSync(modelsDir)) fs.mkdirSync(modelsDir, { recursive: true });

  const tableName = pluralize(entityName);

  const migName = `${timestamp()}-create-${tableName}.ts`;
  const migrationContent = buildMigration(entityName, fields, tableName);
  fs.writeFileSync(path.join(migrationsDir, migName), migrationContent, 'utf8');

  const modelFileName = `${pascalCase(entityName)}Model.ts`;
  const modelContent = buildModel(entityName, fields, tableName);
  fs.writeFileSync(path.join(modelsDir, modelFileName), modelContent, 'utf8');

  console.log('---------------------------------------------');
  console.log('Generated:');
  console.log(' Migration:', migName);
  console.log(' Model    :', modelFileName);
  console.log(' Table    :', tableName);
  console.log(' Fields   :', fields.map((f) => f.name).join(', '));
  console.log('Next steps:');
  console.log(' 1) Review the generated files.');
  console.log(
    ' 2) Run: NODE_OPTIONS="-r ts-node/register -r dotenv/config" npx sequelize-cli db:migrate',
  );
  console.log('---------------------------------------------');
}

try {
  main();
} catch (e: any) {
  console.error('Error:', e.message);
  process.exit(1);
}
