import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ProjectModule } from '../project/project.module';
import { GeneratorModule } from '../generator/generator.module';

@Module({
  imports: [GeneratorModule, ProjectModule],
  providers: [AppService],
})
export class AppModule {}
