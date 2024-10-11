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
  apis: ['./src/products/product.router.ts', './src/trainer/trainer.router.ts', 'src/local/local.router.ts', 'src/local.services/local.service.router.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);