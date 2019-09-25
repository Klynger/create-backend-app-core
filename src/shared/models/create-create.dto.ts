import { CreateLayerDto } from './create-layer.dto';

export interface CreateAttribute {
  required: boolean;
  name: string;
  type: string;
}

export class CreateCreateDto extends CreateLayerDto {
  attributes: CreateAttribute[];
}
