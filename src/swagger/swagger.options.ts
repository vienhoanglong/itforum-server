import { SwaggerDocumentOptions } from '@nestjs/swagger';

export const swaggerOptions: SwaggerDocumentOptions = {
  deepScanRoutes: true,
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
