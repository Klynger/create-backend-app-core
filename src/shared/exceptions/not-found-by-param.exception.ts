import { NotFoundException } from '@nestjs/common';

export class NotFoundByParamException<T> extends NotFoundException {
  constructor(entityName: string, paramName: string, paramValue: T) {
    super(`${entityName} with ${paramName} '${paramValue}' not found`);
  }
}
