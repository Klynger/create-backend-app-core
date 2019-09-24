import { Injectable } from '@nestjs/common';
import { DEFAULT_API_ACTIONS, Verb } from '../utils/constants';
import { CreateServiceDto } from '../shared/models/create-service.dto';
import { CreateControllerDto } from '../shared/models/create-controller.dto';
import { CreateProjectDto, EntityAPIActions } from '../shared/models/create-project.dto';
import { CreateModuleDto } from 'src/shared/models/create-module.dto';
import { CreateModelDto } from 'src/shared/models/create-model.dto';

@Injectable()
export class ProjectService {
  generateProject(createProjectDto: CreateProjectDto) {
    const {
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

    return {
      modelsDto,
      modulesDto,
      servicesDto,
      controllersDto,
    };
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
