import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PostgreSqlOptions } from '@mikro-orm/postgresql/PostgreSqlMikroORM';
import { config } from 'dotenv';
config();

const mikroOrmConfig: PostgreSqlOptions = {
  driver: PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: false,
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
  },
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  migrations: {
    transactional: false,
  },
  debug: false,
};

export default defineConfig(mikroOrmConfig);
