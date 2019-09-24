export class CreateModelDto {
  entityName: string;
  attributes: ModelAttribute[];
}

interface AttributeType {
  typeName: string;
  importable: boolean;
}

interface ModelAttribute {
  required: boolean;
  name: string;
  type: string | AttributeType;
}

export interface ImportableAModelAttribute {
  required: boolean;
  name: string;
  type: AttributeType;
}
