export class CreateModuleDto {
  entityName: string;
  controllers?: string[];
  services?: string[];
  repositories?: string[];
  modules?: string[];
}
