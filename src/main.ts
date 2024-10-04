import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //enables the class validator pipes
  //The white list property set to true ignores all additional properties that are not part of the validation.
  //The exception factory modifies the error response of the class validators in the dtos
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return { property: error.property, constraint: error.constraints };
        });

        return new BadRequestException({
          alert: 'The following errors have been detected',
          errors: cleanErrors,
        });
      },
    }),
  );
  app.use(loggerGlobal);
  const config = new DocumentBuilder()
    .setTitle('ecommerce-bralegz')
    .setDescription(
      'API built with NestJS for the project called ecommerce-bralegz',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
