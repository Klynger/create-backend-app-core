export enum GeneratorStatus {
  NORMAL = 'NORMAL',
  BUSY = 'BUSY',
}

export class GeneratorModel {
  appName?: string;
  port?: number;
  status?: GeneratorStatus;
}
