import {
	Controller,
	Post,
	Body,
	UseGuards,
	Req,
	Get,
	Param,
	Res,
	Put,
	Delete
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UrlsService } from "./urls.service";
import { CreateUrlDto } from "./dto/create-url.dto";
import { UpdateUrlDto } from "./dto/update-url.dto";
import { Response } from "express";
import { AttachUserGuard } from "src/auth/guards/attach-user.guard";

@Controller()
export class UrlsController {
	constructor(private readonly urlsService: UrlsService) {}

	@UseGuards(AttachUserGuard)
	@Post("urls/shorten")
	shorten(@Body() body: CreateUrlDto, @Req() req) {
		return this.urlsService.shorten(body.url, req?.user?.id);
	}

	@Get(":slug")
	async redirect(@Param("slug") slug: string, @Res() res: Response) {
		const url = await this.urlsService.findByShortCode(slug);
		await this.urlsService.incrementClicks(url);
		return res.redirect(url.targetUrl);
	}

	@UseGuards(JwtAuthGuard)
	@Get("urls/list")
	async list(@Req() req) {
		const urls = await this.urlsService.list(req.user.id);
		return urls;
	}

	@UseGuards(JwtAuthGuard)
	@Put("urls/:id")
	update(@Param("id") id: number, @Body() body: UpdateUrlDto, @Req() req) {
		return this.urlsService.update(id, body.url, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete("urls/:id")
	delete(@Param("id") id: number, @Req() req) {
		return this.urlsService.delete(id, req.user.id);
	}
}
