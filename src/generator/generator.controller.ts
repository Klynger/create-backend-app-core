import { Controller, Get, Post, Body, BadRequestException, HttpCode, HttpStatus, Delete, Param } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorModel } from '../shared/models/generator.model';

@Controller('generator')
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Get()
  public getAllRegistredGenerators(): GeneratorModel[] {
    return this.generatorService.getAllRegistredGenerators();
  }

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  public saveGenerator(@Body() generator: GeneratorModel): void {
    const { appName, port, status } = generator;
    if (!appName || !port || !status) {
      throw new BadRequestException('You have to pass appName, port and the status');
    }
    generator.appName = this.formatAppName(generator.appName);
    this.generatorService.saveGenerator(generator);
  }

  @Delete(':appName')
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteGenerator(@Param('appName') appName: string): void {
    appName = this.formatAppName(appName);
    this.generatorService.deleteGenerator(appName);
  }

  private formatAppName(appName: string) {
    return appName.trim().toLowerCase();
  }
}
