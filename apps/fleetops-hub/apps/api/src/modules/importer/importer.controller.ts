import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ImporterService } from './importer.service';

@Controller('import')
export class ImporterController {
  constructor(private readonly importerService: ImporterService) {}

  @Post('validate')
  async validate(@Body() body: { data: any[], mapping: Record<string, string>, type: string }) {
    if (!body.data || !body.mapping || !body.type) {
      throw new BadRequestException('Missing data, mapping, or type');
    }
    return this.importerService.validateAndMap(body.data, body.mapping, body.type);
  }

  @Post('execute')
  async execute(@Body() body: { validData: any[], type: string }) {
    if (!body.validData || !body.type) {
      throw new BadRequestException('Missing validData or type');
    }
    return this.importerService.executeImport(body.validData, body.type);
  }
}