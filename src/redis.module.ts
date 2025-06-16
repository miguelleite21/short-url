import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { createKeyv } from "@keyv/redis";

function buildRedisUri(): string {
	const { CACHE_USERNAME, CACHE_PASSWORD, CACHE_HOST, CACHE_PORT } = process.env;

	if (CACHE_PASSWORD) {
		const user = CACHE_USERNAME ? `${CACHE_USERNAME}:` : "";
		return `redis://${user}${CACHE_PASSWORD}@${CACHE_HOST}:${CACHE_PORT}`;
	}

	return `redis://${CACHE_HOST}:${CACHE_PORT}`;
}

@Module({
	imports: [
		CacheModule.register({
			isGlobal: true,
			store: createKeyv(buildRedisUri())
		})
	]
})
export class RedisModule {}
