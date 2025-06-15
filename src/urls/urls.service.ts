import { Injectable, NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { ShortUrl } from "./entities/url.entity";
import { FormattedCreateUrl, FormattedUrl } from "./dto/url-return.dto";

@Injectable()
export class UrlsService {
	private readonly alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	private readonly slugLength = 6;

	constructor(private readonly em: EntityManager) {}

	async shorten(Url: string, userId?: number): Promise<FormattedCreateUrl> {
		const shortCode = await this.generateUniqueSlug();
		const url = this.em.create(ShortUrl, {
			shortCode,
			targetUrl: Url,
			owner: userId ?? undefined,
			clickCount: 0
		});
		await this.em.persistAndFlush(url);
		const { owner: _, ...rest } = url;
		return {
			...rest,
			createdAt: url.createdAt
				? url.createdAt.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
				: ""
		};
	}

	private generateSlug(): string {
		let result = "";
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
		if (!url) throw new NotFoundException("URL not found");
		return url;
	}

	async incrementClicks(url: ShortUrl) {
		url.clickCount++;
		await this.em.flush();
	}

	async list(userId: number): Promise<FormattedUrl[]> {
		const results = await this.em.findAll(ShortUrl, {
			where: { owner: userId, deletedAt: null },
			fields: ["id", "shortCode", "targetUrl", "clickCount", "createdAt", "updatedAt"]
		});

		return (results ?? []).map((url) => ({
			...url,
			createdAt: url.createdAt
				? new Date(url.createdAt).toLocaleString("pt-BR", {
						dateStyle: "short",
						timeStyle: "short"
					})
				: "",
			updatedAt: url.updatedAt
				? new Date(url.updatedAt).toLocaleString("pt-BR", {
						dateStyle: "short",
						timeStyle: "short"
					})
				: ""
		}));
	}

	async update(
		id: number,
		newUrl: string,
		userId: number
	): Promise<Pick<ShortUrl, "id" | "shortCode" | "targetUrl">> {
		const url = await this.em.findOne(ShortUrl, { id, deletedAt: null, owner: userId });
		if (!url) throw new NotFoundException("URL not found");
		url.targetUrl = newUrl;
		await this.em.flush();
		return {
			id: url.id,
			shortCode: url.shortCode,
			targetUrl: url.targetUrl
		};
	}

	async delete(id: number, userId: number): Promise<string> {
		const url = await this.em.findOne(ShortUrl, { id, owner: userId, deletedAt: null });
		if (!url) throw new NotFoundException("URL not found");

		url.deletedAt = new Date();
		await this.em.flush();
		return "URL deleted successfully";
	}
}
