import * as fs from 'fs';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PROJECTS_DIR } from '../utils/constants';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    const rootDir = process.cwd();
    const fullProjectsDir = `${rootDir}/${PROJECTS_DIR}`;

    if (!fs.existsSync(fullProjectsDir)) {
      fs.mkdirSync(fullProjectsDir);
    }
  }
}
