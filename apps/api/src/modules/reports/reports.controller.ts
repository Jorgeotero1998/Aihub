import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { ReportsService } from "./reports.service";

@ApiTags("reports")
@Controller("/reports")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/overview")
  async overview() {
    return await this.reports.overview();
  }
}

