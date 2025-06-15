import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	@ApiOperation({ summary: "Register a new user" })
	@ApiResponse({ status: 201, description: "User Created Successfully." })
	@ApiResponse({ status: 400, description: "Email is already registered." })
	register(@Body() body: RegisterDto) {
		return this.authService.register(body.email, body.password);
	}

	@Post("login")
	@ApiOperation({ summary: "Authenticate an existing user" })
	@ApiResponse({ status: 200, description: "Login successful, token returned." })
	@ApiResponse({ status: 401, description: "Invalid credentials." })
	login(@Body() body: LoginDto) {
		return this.authService.login(body.email, body.password);
	}
}
