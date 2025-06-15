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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("urls")
@Controller()
export class UrlsController {
	constructor(private readonly urlsService: UrlsService) {}

	@UseGuards(AttachUserGuard)
	@Post("urls/shorten")
	@ApiBearerAuth()
	@ApiOperation({
		summary: "Shorten a given URL",
		description: "Access this route optionally authenticated"
	})
	@ApiResponse({ status: 201, description: "URL shortened successfully." })
	shorten(@Body() body: CreateUrlDto, @Req() req) {
		return this.urlsService.shorten(body.url, req?.user?.id);
	}

	@Get(":slug")
	@ApiOperation({ summary: "Redirect to the original URL based on short code" })
	@ApiResponse({ status: 302, description: "Redirect to the target URL." })
	@ApiResponse({ status: 404, description: "URL not found." })
	async redirect(@Param("slug") slug: string, @Res() res: Response) {
		const url = await this.urlsService.findByShortCode(slug);
		await this.urlsService.incrementClicks(url);
		return res.redirect(url.targetUrl);
	}

	@UseGuards(JwtAuthGuard)
	@Get("urls/list")
	@ApiBearerAuth()
	@ApiOperation({ summary: "List URLs for the authenticated user" })
	@ApiResponse({ status: 200, description: "List of URLs returned." })
	list(@Req() req) {
		return this.urlsService.list(req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Put("urls/:id")
	@ApiBearerAuth()
	@ApiOperation({ summary: "Update a URL by ID" })
	@ApiResponse({ status: 200, description: "URL updated successfully." })
	@ApiResponse({ status: 404, description: "URL not found." })
	update(@Param("id") id: number, @Body() body: UpdateUrlDto, @Req() req) {
		return this.urlsService.update(id, body.url, req.user.id);
	}

	@UseGuards(JwtAuthGuard)
	@Delete("urls/:id")
	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete a URL by ID" })
	@ApiResponse({ status: 200, description: "URL deleted successfully." })
	@ApiResponse({ status: 404, description: "URL not found." })
	delete(@Param("id") id: number, @Req() req) {
		return this.urlsService.delete(id, req.user.id);
	}
}
