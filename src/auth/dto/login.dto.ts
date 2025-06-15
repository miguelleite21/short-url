import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
	@ApiProperty({ description: "User email", example: "jhon.doe@email.com" })
	@IsEmail()
	email: string;

	@ApiProperty({ description: "User password", example: "password1234" })
	@IsString()
	password: string;
}
