import { Layer, Verb } from '../../utils/constants';
import { CreateLayerDto } from './create-layer.dto';

export class CreateControllerDto extends CreateLayerDto {
  implementedMethods: Verb[];
  layerBellow?: Layer;
}
