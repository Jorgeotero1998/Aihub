import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RagService } from "./rag.service";

@ApiTags("rag")
@Controller("/rag")
export class RagController {
  constructor(private readonly rag: RagService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post("/ask")
  async ask(@Body() body: { question: string }) {
    return await this.rag.ask(body.question ?? "");
  }
}

