import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ShortUrl } from './entities/url.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [ShortUrl] })],
  providers: [UrlsService],
  controllers: [UrlsController],
})
export class UrlsModule {}
