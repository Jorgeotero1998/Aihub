import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { JwtUser } from "../auth/jwt.strategy";
import { TenancyService } from "./tenancy.service";

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  readonly tenantId: string | null;

  constructor(
    @Inject(REQUEST) req: Request,
    tenancy: TenancyService
  ) {
    const user = req.user as JwtUser | undefined;
    this.tenantId = tenancy.getTenantIdFromRequest(req) ?? user?.tenantId ?? null;
  }
}

