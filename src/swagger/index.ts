import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_API } from './swagger.constants';
export const setupSwagger = (app: INestApplication) => {
  const swaggerConfigs = new DocumentBuilder()
    .setTitle(SWAGGER_API.NAME)
    .setDescription(SWAGGER_API.DESCRIPTION)
    .setVersion(SWAGGER_API.VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfigs);
  SwaggerModule.setup(SWAGGER_API.ENDPOINT, app, document);
};
