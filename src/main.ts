import * as detect from 'detect-port';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { INestApplication } from '@nestjs/common';

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;

async function run(app: INestApplication, port: number) {
  await app.listen(port);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await detect(DEFAULT_PORT).then(port => {
    if (port === DEFAULT_PORT) {
      run(app, port);
      return;
    }

    // tslint:disable-next-line:no-console
    console.log(`Something is running on port ${
      DEFAULT_PORT
    }, running on port ${port}`);

    process.env.PORT = port.toString();
    run(app, port);
  });
}
bootstrap();
