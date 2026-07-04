import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { CalendarService } from "./calendar.service";

@ApiTags("calendar")
@Controller("/calendar")
export class CalendarController {
  constructor(private readonly cal: CalendarService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get("/events")
  async list() {
    return await this.cal.list();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/events")
  async create(
    @Body()
    body: { title: string; startAt: string; endAt: string; kind?: string }
  ) {
    return await this.cal.create(body);
  }
}

