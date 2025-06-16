import { describe, it, expect, beforeEach, vi } from "vitest";
import { NotFoundException } from "@nestjs/common";
import { EntityManager } from "@mikro-orm/postgresql";
import { Cache } from "cache-manager";
import { UrlsService } from "../urls.service";
import { ShortUrl } from "../entities/url.entity";

describe("UrlsService", () => {
	let service: UrlsService;
	let em: EntityManager;
	let cache: Cache;

	beforeEach(() => {
		em = {
			create: vi.fn(),
			persistAndFlush: vi.fn(),
			findOne: vi.fn(),
			findAll: vi.fn(),
			flush: vi.fn()
		} as any;

		cache = {
			get: vi.fn(),
			set: vi.fn()
		} as any;

		service = new UrlsService(em, cache);
	});

	describe("shorten", () => {
		it("should create and return formatted URL", async () => {
			const fakeUrl = "http://example.com";
			const fakeSlug = "ABC123";
			vi.spyOn(service as any, "generateUniqueSlug").mockResolvedValue(fakeSlug);

			const mockEntity = {
				shortCode: fakeSlug,
				targetUrl: fakeUrl,
				createdAt: new Date(),
				clickCount: 0
			} as any;
			vi.mocked(em.create).mockReturnValue(mockEntity);
			vi.mocked(em.persistAndFlush).mockResolvedValue(undefined);

			const res = await service.shorten(fakeUrl, 42);

			expect(em.create).toHaveBeenCalledWith(ShortUrl, {
				shortCode: fakeSlug,
				targetUrl: fakeUrl,
				owner: 42,
				clickCount: 0
			});
			expect(em.persistAndFlush).toHaveBeenCalledWith(mockEntity);
			expect(res).toMatchObject({
				shortCode: fakeSlug,
				targetUrl: fakeUrl,
				clickCount: 0,
				createdAt: expect.any(String)
			});
		});
	});

	describe("findByShortCode", () => {
		const code = "XYZ789";
		const cacheKey = `shorturl:${code}`;

		it("should return from cache when present", async () => {
			const cached = {} as any;
			vi.mocked(cache.get).mockResolvedValue(cached);

			const res = await service.findByShortCode(code);
			expect(cache.get).toHaveBeenCalledWith(cacheKey);
			expect(res).toBe(cached);
		});

		it("should fetch from DB, cache it and return", async () => {
			vi.mocked(cache.get).mockResolvedValue(null);
			const entity = { shortCode: code } as any;
			vi.mocked(em.findOne).mockResolvedValue(entity);
			vi.mocked(cache.set).mockResolvedValue(undefined);

			const res = await service.findByShortCode(code);
			expect(em.findOne).toHaveBeenCalledWith(ShortUrl, { shortCode: code, deletedAt: null });
			expect(cache.set).toHaveBeenCalledWith(cacheKey, entity, 30);
			expect(res).toBe(entity);
		});

		it("should throw NotFoundException if not found", async () => {
			vi.mocked(cache.get).mockResolvedValue(null);
			vi.mocked(em.findOne).mockResolvedValue(null);

			await expect(service.findByShortCode(code)).rejects.toThrow(NotFoundException);
		});
	});

	describe("incrementClicks", () => {
		it("should increment clickCount and flush", async () => {
			const url = { clickCount: 5 } as any;
			await service.incrementClicks(url);
			expect(url.clickCount).toBe(6);
			expect(em.flush).toHaveBeenCalled();
		});
	});

	describe("list", () => {
		it("should return formatted list", async () => {
			const now = new Date();
			const rows = [
				{
					id: 1,
					shortCode: "A1B2C3",
					targetUrl: "u",
					clickCount: 2,
					createdAt: now,
					updatedAt: now
				}
			];
			vi.mocked(em.findAll).mockResolvedValue(rows);

			const res = await service.list(7);
			expect(em.findAll).toHaveBeenCalledWith(ShortUrl, {
				where: { owner: 7, deletedAt: null },
				fields: ["id", "shortCode", "targetUrl", "clickCount", "createdAt", "updatedAt"]
			});
			expect(res[0]).toMatchObject({
				id: 1,
				shortCode: "A1B2C3",
				targetUrl: "u",
				clickCount: 2,
				createdAt: expect.any(String),
				updatedAt: expect.any(String)
			});
		});
	});

	describe("update", () => {
		it("should update targetUrl and return fields", async () => {
			const entity = { id: 9, shortCode: "X1", targetUrl: "old" } as any;
			vi.mocked(em.findOne).mockResolvedValue(entity);
			vi.mocked(em.flush).mockResolvedValue(undefined);

			const res = await service.update(9, "new", 3);
			expect(entity.targetUrl).toBe("new");
			expect(em.flush).toHaveBeenCalled();
			expect(res).toEqual({ id: 9, shortCode: "X1", targetUrl: "new" });
		});

		it("should throw NotFoundException if not found", async () => {
			vi.mocked(em.findOne).mockResolvedValue(null);
			await expect(service.update(1, "u", 2)).rejects.toThrow(NotFoundException);
		});
	});

	describe("delete", () => {
		it("should mark deletedAt and flush", async () => {
			const entity = { id: 5, deletedAt: null } as any;
			vi.mocked(em.findOne).mockResolvedValue(entity);
			vi.mocked(em.flush).mockResolvedValue(undefined);

			const res = await service.delete(5, 4);
			expect(entity.deletedAt).toBeInstanceOf(Date);
			expect(em.flush).toHaveBeenCalled();
			expect(res).toBe("URL deleted successfully");
		});

		it("should throw NotFoundException if not found", async () => {
			vi.mocked(em.findOne).mockResolvedValue(null);
			await expect(service.delete(5, 4)).rejects.toThrow(NotFoundException);
		});
	});
});
