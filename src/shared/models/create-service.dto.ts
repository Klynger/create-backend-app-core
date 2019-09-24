import { Verb, Layer } from '../../utils/constants';

export class CreateServiceDto {
  entityName: string;
  layerBellow?: Layer;
  implementedMethods: Verb[];
}
