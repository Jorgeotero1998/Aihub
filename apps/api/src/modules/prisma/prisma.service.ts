import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);
  private connected = false;

  async onModuleInit() {
    try {
      await this.$connect();
      this.connected = true;
    } catch (e) {
      // Allow API to boot in demo mode even if DB is down.
      this.connected = false;
      const msg = e instanceof Error ? e.message : String(e);
      this.logger.warn(`DB not connected (demo mode). ${msg}`);
    }
  }

  isConnected() {
    return this.connected;
  }

  async setTenant(tenantId: string | null) {
    // For Postgres RLS policies using current_setting('app.tenant_id')
    const value = tenantId ?? "";
    if (!this.connected) return;
    await this.$executeRaw(Prisma.sql`SELECT set_config('app.tenant_id', ${value}, true);`);
  }
}

