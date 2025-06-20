import { Module } from "@nestjs/common";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import mikroOrmConfig from "../mikro-orm.config";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { UrlsModule } from "./urls/urls.module";
import { RedisModule } from "./redis.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		MikroOrmModule.forRoot(mikroOrmConfig),
		AuthModule,
		UrlsModule,
		RedisModule
	]
})
export class AppModule {}
