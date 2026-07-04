import { Global, Module } from "@nestjs/common";
import { TenancyService } from "./tenancy.service";
import { TenantInterceptor } from "./tenant.interceptor";
import { TenantContext } from "./tenant.context";

@Global()
@Module({
  providers: [TenancyService, TenantInterceptor, TenantContext],
  exports: [TenancyService, TenantInterceptor, TenantContext],
})
export class TenancyModule {}

