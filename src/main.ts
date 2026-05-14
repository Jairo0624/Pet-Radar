import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as appInsights from 'applicationinsights';

async function bootstrap() {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING)
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .start();
    console.log('⚡ Azure Application Insights activado');
  }
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
