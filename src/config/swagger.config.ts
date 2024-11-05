import swaggerJSDoc from 'swagger-jsdoc';
import {envs} from './envs';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swagger API',
    version: '1.0.0',
    description: '',
    contact: {
      name: ': Jhon Elvis',
      email: 'correo@example.com',
    }
  },
  servers: [
    {
      url: `${envs.server_url}`,
      description: 'Production server',
    },
    {
      url: `http://localhost:${envs.PORT}`, 
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/presentation/products/product.router.ts', './src/documentation/swagger.trainer.ts', 'src/documentation/swagger.local.ts', 'src/documentation/swagger.local.services.ts', 'src/documentation/swagger.membership.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);