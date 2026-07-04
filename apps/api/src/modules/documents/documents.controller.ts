import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { DocumentsService } from "./documents.service";

@ApiTags("documents")
@Controller("/documents")
export class DocumentsController {
  constructor(private readonly docs: DocumentsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Get()
  async list() {
    return await this.docs.list();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"))
  @Post()
  async create(@Body() body: { title: string; mimeType?: string; content: string }) {
    return await this.docs.create(body);
  }
}

