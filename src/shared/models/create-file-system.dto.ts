import { FileGenerated } from './file-generated.model';

export class CreateFileSystemDto {
  projectName: string;
  files: FileGenerated[];
}
