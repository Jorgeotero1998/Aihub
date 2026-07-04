import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { TenancyModule } from "./tenancy/tenancy.module";
import { RealtimeModule } from "./realtime/realtime.module";
import { HealthController } from "./health/health.controller";
import { RagModule } from "./rag/rag.module";
import { TasksModule } from "./tasks/tasks.module";
import { CalendarModule } from "./calendar/calendar.module";
import { ReportsModule } from "./reports/reports.module";
import { DocumentsModule } from "./documents/documents.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { BillingModule } from "./billing/billing.module";
import { AdminModule } from "./admin/admin.module";
import { AgentsModule } from "./agents/agents.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    PrismaModule,
    TenancyModule,
    AuthModule,
    RealtimeModule,
    RagModule,
    TasksModule,
    CalendarModule,
    ReportsModule,
    DocumentsModule,
    NotificationsModule,
    BillingModule,
    AdminModule,
    AgentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

