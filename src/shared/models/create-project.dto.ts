import { CreateModuleDto } from './create-module.dto';

export interface APIConfig {
  generator: string;
  controllers?: boolean;
  services?: boolean;
  models?: boolean;
  repositories?: boolean;
  modules?: boolean | CreateModuleDto[];
}

export interface EntityAPIActions {
  get?: boolean;
  post?: boolean;
  put?: boolean;
  delete?: boolean;
}

type EntityName = string;
type AttributeName = string;

export interface AttributeType {
  typeName: string;
  importable: boolean;
}

interface Attribute {
  required?: boolean;
  type: string | AttributeType;
}

interface EntityConfig {
  apiActions: EntityAPIActions;
  attributes: Record<AttributeName, Attribute>;
}

export class CreateProjectDto {
  projectName: string;
  apiConfig: APIConfig;
  entities: Record<EntityName, EntityConfig>;
}
