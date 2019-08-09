import { Module } from '@nestjs/common';
import { GeneratorService } from './generator.service';
import { GeneratorRepository } from './generator.repository';
import { GeneratorController } from './generator.controller';

@Module({
  controllers: [GeneratorController],
  providers: [GeneratorService, GeneratorRepository],
})
export class GeneratorModule {}
