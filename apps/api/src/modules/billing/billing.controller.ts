import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { BillingService } from "./billing.service";

@ApiTags("billing")
@Controller("/billing")
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/me")
  async me() {
    return await this.billing.getOrCreate();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/checkout")
  async checkout(@Body() body: { plan?: string }) {
    return await this.billing.checkout(body.plan ?? "pro");
  }
}

