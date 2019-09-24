import { CreateLayerDto } from './create-layer.dto';

export class CreateModelDto extends CreateLayerDto {
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
