import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class CreateUrlDto {
	@ApiProperty({ description: "Full url", example: "https://www.google.com.br" })
	@IsUrl()
	url: string;
}
