import { Layer, Verb } from '../../utils/constants';

export class CreateControllerDto {
  implementedMethods: Verb[];
  entityName: string;
  layerBellow?: Layer;
}
