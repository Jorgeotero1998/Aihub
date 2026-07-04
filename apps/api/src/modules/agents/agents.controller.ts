import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { AgentsService } from "./agents.service";

@ApiTags("agents")
@Controller("/agents")
export class AgentsController {
  constructor(private readonly agents: AgentsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/run")
  async run(@Body() body: { agentId: string; message: string }) {
    return await this.agents.run(body.agentId, body.message);
  }
}

