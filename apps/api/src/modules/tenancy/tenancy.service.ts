import { Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class TenancyService {
  getTenantIdFromRequest(req: Request): string | null {
    const header = (req.headers["x-tenant-id"] as string | undefined) ?? null;
    if (header && header.trim()) return header.trim();
    return null;
  }
}

