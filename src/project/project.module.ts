import { ProjectService } from './project.service';
import { Module, HttpModule } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { FilesCreationService } from './files-creation.service';

@Module({
  imports: [HttpModule],
  providers: [ProjectService, FilesCreationService],
  controllers: [ProjectController],
})
export class ProjectModule {}
