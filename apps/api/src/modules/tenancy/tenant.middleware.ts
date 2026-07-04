import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PrismaService } from "../prisma/prisma.service";
import { JwtUser } from "../auth/jwt.strategy";
import { TenancyService } from "./tenancy.service";

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(
    private readonly tenancy: TenancyService,
    private readonly prisma: PrismaService
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    const user = req.user as JwtUser | undefined;
    const tenantId = this.tenancy.getTenantIdFromRequest(req) ?? user?.tenantId ?? null;
    await this.prisma.setTenant(tenantId);
    next();
  }
}

