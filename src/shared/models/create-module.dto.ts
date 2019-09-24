import { CreateLayerDto } from './create-layer.dto';

export class CreateModuleDto extends CreateLayerDto {
  controllers?: string[];
  services?: string[];
  repositories?: string[];
  modules?: string[];
}
