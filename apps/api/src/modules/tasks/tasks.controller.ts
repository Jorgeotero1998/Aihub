import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { TasksService } from "./tasks.service";

@ApiTags("tasks")
@Controller("/tasks")
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  async list() {
    return await this.tasks.list();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(@Body() body: { title: string; dueAt?: string | null }) {
    return await this.tasks.create(body);
  }
}

