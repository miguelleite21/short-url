import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = new DocumentBuilder()
		.setTitle("Minha API")
		.setDescription("Documentação da API com NestJS e Swagger")
		.setVersion("1.0")
		.addBearerAuth(
			{
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT"
			},
			"bearer"
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);
	app.useGlobalPipes(new ValidationPipe());
	await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
	console.error("ootstrap error:", err);
	process.exit(1);
});
