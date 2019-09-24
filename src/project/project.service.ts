import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { prop, flatten } from 'ramda';
import { Injectable, HttpService } from '@nestjs/common';
import { CreateLayerDto } from 'src/shared/models/create-layer.dto';
import { CreateModelDto } from 'src/shared/models/create-model.dto';
import { DEFAULT_API_ACTIONS, Verb, Layer } from '../utils/constants';
import { CreateModuleDto } from 'src/shared/models/create-module.dto';
import { CreateServiceDto } from '../shared/models/create-service.dto';
import { CreateControllerDto } from '../shared/models/create-controller.dto';
import { CreateProjectDto, EntityAPIActions } from '../shared/models/create-project.dto';
import { FilesCreationService } from './files-creation.service';
import { FileGenerated } from 'src/shared/models/file-generated.model';

@Injectable()
export class ProjectService {
  constructor(private readonly httpService: HttpService, private readonly filesCreationService: FilesCreationService) {}

  generateFileRequestFn(route: string) {
    return (input: CreateLayerDto) => this.httpService.post(`http://localhost:3001/${route}`, input).pipe(map(prop('data')));
  }

  async generateProject(createProjectDto: CreateProjectDto) {
    const {
      projectName,
      apiConfig: {
        modules = true,
        services = true,
        controllers = true,
        models = true,
      },
    } = createProjectDto;

    const controllersDto = controllers ? this.extractControllerInput(createProjectDto) : [];
    const servicesDto = modules ? this.extractServicesInput(createProjectDto) : [];
    const modulesDto = services ? this.extractModulesInput(createProjectDto) : [];
    const modelsDto = models ? this.extractModelsInput(createProjectDto) : [];

    const controllersObs = controllersDto.map(this.generateFileRequestFn(Layer.controller));
    const servicesObs = servicesDto.map(this.generateFileRequestFn(Layer.service));
    const modulesObs = modulesDto.map(this.generateFileRequestFn(Layer.module));
    const modelsObs = modelsDto.map(this.generateFileRequestFn('model'));
    const staticFilesObs = this.httpService.get('http://localhost:3001/static-files').pipe(map(prop('data')));

    const files = await forkJoin<FileGenerated>(flatten([controllersObs, servicesObs, modulesObs, modelsObs, staticFilesObs])).toPromise();
    this.filesCreationService.generateFileSystem({ projectName, files: flatten(files) });

    return files;
  }

  private extractModulesInput(createProjectDto: CreateProjectDto): CreateModuleDto[] {
    const {
      apiConfig: {
        modules,
        services = true,
        controllers = true,
        repositories = true,
      },
      entities,
    } = createProjectDto;

    const entitiesNames = Object.keys(entities);

    return entitiesNames.map((entityName: string): CreateModuleDto => ({
      entityName,
      controllers: controllers ? [entityName] : [],
      services: services ? [entityName] : [],
      repositories: repositories ? [entityName] : [],
    })).concat(Array.isArray(modules) ? modules : []);
  }

  private extractModelsInput(createProjectDto: CreateProjectDto): CreateModelDto[] {
    const { entities } = createProjectDto;

    return Object.keys(entities).map(entityName => {
      const entity = entities[entityName];
      const { attributes: rawAttr } = entity;

      const attributes = Object.keys(rawAttr).map(name => ({ required: Boolean(rawAttr[name].required), name, type: rawAttr[name].type  }));
      return {
        entityName,
        attributes,
      };
    });
  }

  private extractServicesInput(createProjectDto: CreateProjectDto): CreateServiceDto[] {
    const {
      apiConfig: {
        repositories = true,
      },
      entities,
    } = createProjectDto;

    const entitiesNames = Object.keys(entities);
    let layerBellow = null;
    if (repositories) {
      layerBellow = 'repository';
    } else if (!repositories) {
      layerBellow = undefined;
    }

    return entitiesNames.map((entityName: string) => ({
      entityName,
      layerBellow,
      implementedMethods: this.getImplementedMethods(entities[entityName].apiActions),
    }));
  }

  private extractControllerInput(createProjectDto: CreateProjectDto): CreateControllerDto[] {
    const {
      apiConfig: {
        services = true,
      },
      entities,
    } = createProjectDto;

    const entitiesNames = Object.keys(entities);
    let layerBellow = null;
    if (services) {
      layerBellow = 'service';
    } else if (!services) {
      layerBellow = undefined;
    }

    return entitiesNames.map((entityName: string) => ({
      entityName,
      layerBellow,
      implementedMethods: this.getImplementedMethods(entities[entityName].apiActions),
    }));
  }

  private getImplementedMethods(apiActions: EntityAPIActions) {
    const actions = {
      ...DEFAULT_API_ACTIONS,
      ...apiActions,
    };

    return Object.keys(actions).filter(action => actions[action]) as Verb[];
  }
}
