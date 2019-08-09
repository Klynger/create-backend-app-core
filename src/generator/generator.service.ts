import { Injectable } from '@nestjs/common';
import { GeneratorRepository } from './generator.repository';
import { GeneratorModel } from '../shared/model/generator.model';
import { NotFoundByParamException } from '../shared/exceptions/not-found-by-param.exception';

@Injectable()
export class GeneratorService {
  constructor(private readonly generatorRepository: GeneratorRepository) {}

  public getAllRegistredGenerators() {
    return this.generatorRepository.getAllGenerators();
  }

  public getGenerator(appName: string) {
    const generator = this.generatorRepository.getGenerator(appName);

    if (!generator) {
      throw new NotFoundByParamException('Generator', 'appName', appName);
    }

    return generator;
  }

  public saveGenerator(generator: GeneratorModel): void {
    this.generatorRepository.saveGenerator(generator);
  }

  public updateGenerator(generator: GeneratorModel): void {
    if (!this.generatorRepository.saveGenerator(generator)) {
      throw new NotFoundByParamException('Generator', 'appName', generator.appName);
    }
  }

  public deleteGenerator(appName: string): void {
    this.getGenerator(appName);
    this.generatorRepository.deleteGenerator(appName);
  }
}
