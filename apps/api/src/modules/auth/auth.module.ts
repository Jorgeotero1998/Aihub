import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { RolesGuard } from "./roles.guard";
import { InMemoryAuthStore } from "./inmemory.store";

@Module({
  imports: [PassportModule.register({ defaultStrategy: "jwt" })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, InMemoryAuthStore],
  exports: [AuthService, InMemoryAuthStore, RolesGuard],
})
export class AuthModule {}

