import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { prop, flatten } from 'ramda';
import { Injectable, HttpService } from '@nestjs/common';
import { FilesCreationService } from './files-creation.service';
import { CreateLayerDto } from 'src/shared/models/create-layer.dto';
import { CreateModelDto } from 'src/shared/models/create-model.dto';
import { DEFAULT_API_ACTIONS, Verb, Layer } from '../utils/constants';
import { CreateModuleDto } from 'src/shared/models/create-module.dto';
import { CreateUpdateDto } from 'src/shared/models/create-update.dto';
import { CreateServiceDto } from '../shared/models/create-service.dto';
import { FileGenerated } from 'src/shared/models/file-generated.model';
import { CreateControllerDto } from '../shared/models/create-controller.dto';
import { CreateProjectDto, EntityAPIActions, AttributeType } from '../shared/models/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly httpService: HttpService, private readonly filesCreationService: FilesCreationService) { }

  generateFileRequestFn(route: string) {
    return (input: CreateLayerDto) => this.httpService.post(`http://localhost:3001/${route}`, input).pipe(map(prop('data')));
  }

  async generateProject(createProjectDto: CreateProjectDto) {
    const {
      projectName,
      apiConfig: {
        models = true,
        modules = true,
        services = true,
        controllers = true,
        repositories = true,
      },
    } = createProjectDto;

    const modelsDto = models ? this.extractModelsInput(createProjectDto) : [];
    const modulesDto = services ? this.extractModulesInput(createProjectDto) : [];
    const servicesDto = modules ? this.extractServicesInput(createProjectDto) : [];
    const controllersDto = controllers ? this.extractControllerInput(createProjectDto) : [];
    const repositoryDto = repositories ? this.extractRepositoryInput(createProjectDto) : [];
    const updateDto = models ? this.extractCreateOrUpdateInput(createProjectDto, Verb.PUT) : [];
    const createDto = models ? this.extractCreateOrUpdateInput(createProjectDto, Verb.POST) : [];

    const modelsObs = modelsDto.map(this.generateFileRequestFn('model'));
    const createObs = createDto.map(this.generateFileRequestFn('create'));
    const updateObs = updateDto.map(this.generateFileRequestFn('update'));
    const modulesObs = modulesDto.map(this.generateFileRequestFn(Layer.module));
    const servicesObs = servicesDto.map(this.generateFileRequestFn(Layer.service));
    const controllersObs = controllersDto.map(this.generateFileRequestFn(Layer.controller));
    const repositoriesObs = repositoryDto.map(this.generateFileRequestFn(Layer.repository));
    const staticFilesObs = this.httpService.get('http://localhost:3001/static-files').pipe(map(prop('data')));

    const files = await forkJoin<FileGenerated>(flatten([
      createObs,
      updateObs,
      modelsObs,
      modulesObs,
      servicesObs,
      controllersObs,
      staticFilesObs,
      repositoriesObs,
  ])).toPromise();
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

      const attributes = Object.keys(rawAttr).map(name => ({ required: Boolean(rawAttr[name].required), name, type: rawAttr[name].type }));
      return {
        entityName,
        attributes,
      };
    });
  }

  private extractCreateOrUpdateInput(createProjectDto: CreateProjectDto, verb: Verb): Array<CreateUpdateDto | CreateUpdateDto> {
    const { entities } = createProjectDto;

    return Object.keys(entities)
      .filter((entityName: string) => Boolean(entities[entityName].apiActions[verb]))
      .map((entityName: string) => {
        const entity = entities[entityName];
        const { attributes: rawAttr } = entity;

        const attributes = Object.keys(rawAttr)
          .filter(name => name !== 'id')
          .map(name => ({ required: Boolean(rawAttr[name].required), name, type: this.getAttributeType(rawAttr[name].type) }));
        return {
          entityName,
          attributes,
        };
      });
  }

  private getAttributeType(type: string | AttributeType) {
    if (typeof type === 'object') {
      const { typeName } = type;
      const arrayRegex = /\[\]/;
      const isArray = arrayRegex.test(typeName);

      return `string${isArray ? '[]' : ''};`;
    }

    return type;
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

  private extractRepositoryInput(createProjectDto: CreateProjectDto) {
    const { entities } = createProjectDto;

    const entitiesNames = Object.keys(entities);

    return entitiesNames.map((entityName: string) => ({
      entityName,
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
