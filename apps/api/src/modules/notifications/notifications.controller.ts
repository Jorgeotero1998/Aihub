import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { NotificationsService } from "./notifications.service";

@ApiTags("notifications")
@Controller("/notifications")
export class NotificationsController {
  constructor(private readonly notifs: NotificationsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  async list() {
    return await this.notifs.list();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/test")
  async test(@Body() body: { title?: string; body?: string }) {
    return await this.notifs.create({
      type: "test",
      title: body.title ?? "Notificación de prueba",
      body: body.body ?? "Esto llegó por WebSockets en tiempo real.",
    });
  }
}

