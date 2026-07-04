import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { PrismaService } from "../prisma/prisma.service";
import { JwtUser } from "../auth/jwt.strategy";
import { TenancyService } from "./tenancy.service";

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(
    private readonly tenancy: TenancyService,
    private readonly prisma: PrismaService
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const user = req.user as JwtUser | undefined;
    const tenantId = this.tenancy.getTenantIdFromRequest(req) ?? user?.tenantId ?? null;
    await this.prisma.setTenant(tenantId);
    return next.handle();
  }
}

