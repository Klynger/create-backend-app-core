import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ProjectModule } from '../project/project.module';
import { GeneratorModule } from '../generator/generator.module';

@Module({
  imports: [GeneratorModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
