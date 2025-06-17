import { defineConfig, PostgreSqlDriver } from "@mikro-orm/postgresql";
import type { PostgreSqlOptions } from "@mikro-orm/postgresql/PostgreSqlMikroORM";
import { config } from "dotenv";
import { ShortUrl } from "src/urls/entities/url.entity";
import { User } from "src/user/user.entity";

config();

const mikroOrmConfig: PostgreSqlOptions = {
	driver: PostgreSqlDriver,
	discovery: {
		warnWhenNoEntities: false
	},
	entities: [ShortUrl, User],
	dbName: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	migrations: {
		transactional: false
	},
	debug: false
};

export default defineConfig(mikroOrmConfig);
