import "reflect-metadata";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./modules/app.module";
import { TenantInterceptor } from "./modules/tenancy/tenant.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidUnknownValues: false })
  );
  app.useGlobalInterceptors(app.get(TenantInterceptor));

  const swaggerConfig = new DocumentBuilder()
    .setTitle("AIhub API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const doc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("/docs", app, doc);

  const port = Number(config.get("PORT") ?? 3001);
  // Bind to IPv6-any so both http://localhost (often ::1) and IPv4 work on Windows.
  await app.listen(port, "::");
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
}

bootstrap();

