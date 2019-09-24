import * as fs from 'fs';
import * as UUID from 'uuidjs';
import { Injectable } from '@nestjs/common';
import { CreateFileSystemDto } from '../shared/models/create-file-system.dto';
import { PROJECTS_DIR } from '../utils/constants';
import { FileGenerated } from 'src/shared/models/file-generated.model';

@Injectable()
export class FilesCreationService {
  fullProjectsDir: string;

  constructor() {
    this.fullProjectsDir = `${process.cwd()}/${PROJECTS_DIR}`;
  }

  generateFileSystem({ projectName, files }: CreateFileSystemDto) {
    const projectDirName = `${UUID.generate()}-${projectName}`;
    const projectPath = `${this.fullProjectsDir}/${projectDirName}`;
    fs.mkdirSync(projectPath);
    files.forEach(this.resolveFile(projectPath));

    // files.forEach(file => {
    //   console.log({ file });
    // });
  }

  private resolveFile(rootDir: string) {
    return ({ path, code }: FileGenerated) => {
      const dirs = path.split('/');

      dirs.reduce((accDirs: string, curDir: string, curIndex: number) => {
        const fullFilePath = `${accDirs}/${curDir}`;

        if (curIndex === dirs.length - 1) {
          fs.writeFileSync(fullFilePath, code);
        } else if (!fs.existsSync(fullFilePath)) {
          fs.mkdirSync(fullFilePath);
        }

        return fullFilePath;
      }, rootDir);
    };
  }
}
