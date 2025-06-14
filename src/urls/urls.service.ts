import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { ShortUrl } from './entities/url.entity';

@Injectable()
export class UrlsService {
  private readonly alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private readonly slugLength = 6;

  constructor(private readonly em: EntityManager) {}

  async shorten(originalUrl: string, userId?: number): Promise<ShortUrl> {
    const shortCode = await this.generateUniqueSlug();
      const url = this.em.create(ShortUrl, {
        shortCode,
        targetUrl: originalUrl,
        owner: userId ?? undefined,
        clickCount: 0,
      });
    await this.em.persistAndFlush(url);
    return url;
  }

  //retornar id code e url
  private generateSlug(): string {
    let result = '';
    const { alphabet, slugLength } = this;
    for (let i = 0; i < slugLength; i++) {
      const idx = Math.floor(Math.random() * alphabet.length);
      result += alphabet[idx];
    }
    return result;
  }

  private async generateUniqueSlug(): Promise<string> {
    let shortCode: string;
    do {
      shortCode = this.generateSlug();
    } while (await this.em.findOne(ShortUrl, { shortCode, deletedAt: null }));
    return shortCode;
  }

  async findByShortCode(shortCode: string): Promise<ShortUrl> {
    const url = await this.em.findOne(ShortUrl, { shortCode, deletedAt: null });
    if (!url) throw new NotFoundException('URL not found');
    return url;
  }

  async incrementClicks(url: ShortUrl) {
    url.clickCount++;
    await this.em.flush();
  }
// nao pode retornar erro se nao achar tem que retornar array vazio
//retornar id code e url
  async list(userId:number){
    return  this.em.findAll(ShortUrl, {where:{owner:userId,deletedAt: null}})
  }

//retornar id code e url
async update(id: number, newUrl: string, userId:number): Promise<ShortUrl> {
  const url = await this.em.findOne(ShortUrl, { id, deletedAt: null, owner:userId });
  if (!url) throw new NotFoundException('URL not found');
  url.targetUrl = newUrl;
  await this.em.flush();
  return url;
}


async delete(id: number, userId:number): Promise<void> {
  const url = await this.em.findOne(ShortUrl, { id, owner:userId, deletedAt: null });
  if (!url) throw new NotFoundException('URL not found');
  await this.em.removeAndFlush(url);
}
}
