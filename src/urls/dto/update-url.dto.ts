import { IsUrl } from "class-validator";

export class UpdateUrlDto {
	@IsUrl()
	url: string;
}
