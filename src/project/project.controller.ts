import { Controller, Post, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from '../shared/models/create-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  generateProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.generateProject(createProjectDto);
  }
}
