import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { DemoStore } from "../demo/demo.store";

@Global()
@Module({
  providers: [PrismaService, DemoStore],
  exports: [PrismaService, DemoStore],
})
export class PrismaModule {}

