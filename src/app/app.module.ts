import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GeneratorModule } from '../generator/generator.module';

@Module({
  imports: [GeneratorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
