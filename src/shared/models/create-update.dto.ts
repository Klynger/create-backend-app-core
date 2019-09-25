import { CreateLayerDto } from './create-layer.dto';

export interface UpdateAttribute {
  required: boolean;
  name: string;
  type: string;
}

export class CreateUpdateDto extends CreateLayerDto {
  attributes: UpdateAttribute[];
}
