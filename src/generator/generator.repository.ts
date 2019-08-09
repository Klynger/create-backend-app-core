import { Injectable } from '@nestjs/common';
import { GeneratorModel } from 'src/shared/model/generator.model';

interface GeneratorMap {
  [key: string]: GeneratorModel;
}

@Injectable()
export class GeneratorRepository {
  private _generators: GeneratorMap;

  constructor() {
    this._generators = {};
  }

  public getAllGenerators(): GeneratorModel[] {
    return Object.keys(this._generators).map(key => this._generators[key]);
  }

  public getGenerator(appName: string): GeneratorModel | null {
    const generator = this._generators[appName];
    if (!generator) {
      return null;
    }

    return generator;
  }

  public saveGenerator(generator: GeneratorModel): GeneratorModel | null {
    if (!generator.appName) {
      return null;
    }
    return this._generators[generator.appName] = generator;
  }

  public deleteGenerator(appName: string): void {
    delete this._generators[appName];
  }
}
