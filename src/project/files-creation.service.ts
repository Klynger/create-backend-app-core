import * as fs from 'fs';
import * as UUID from 'uuidjs';
import { zip } from 'zip-a-folder';
import { Injectable } from '@nestjs/common';
import { PROJECTS_DIR } from '../utils/constants';
import { FileGenerated } from 'src/shared/models/file-generated.model';
import { CreateFileSystemDto } from '../shared/models/create-file-system.dto';

@Injectable()
export class FilesCreationService {
  fullProjectsDir: string;

  constructor() {
    this.fullProjectsDir = `${process.cwd()}/${PROJECTS_DIR}`;
  }

  async generateFileSystem({ projectName, files }: CreateFileSystemDto) {
    const projectDirName = `${UUID.generate()}-${projectName}`;
    const projectPath = `${this.fullProjectsDir}/${projectDirName}`;
    const zipPath = `${projectPath}.zip`;
    fs.mkdirSync(projectPath);
    files.forEach(this.resolveFile(projectPath));

    await zip(projectPath, zipPath);

    return fs.readFileSync(zipPath, { encoding: 'base64' });
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
