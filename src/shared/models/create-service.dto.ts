import { Verb, Layer } from '../../utils/constants';
import { CreateLayerDto } from './create-layer.dto';

export class CreateServiceDto extends CreateLayerDto {
  entityName: string;
  layerBellow?: Layer;
  implementedMethods: Verb[];
}
