import express, { Router } from 'express';
import cors from 'cors';

import swaggerUI from 'swagger-ui-express'
import { swaggerSpec } from '../config';

export class Server {
   public readonly app = express();
   private readonly port: number;
   private readonly router: Router;

   constructor(port = 3000, router: Router) {
      this.port = port;
      this.router = router;
   }

   public async start() {

      this.app.disable('x-powered-by');

      //* Middlewares
      this.app.use(express.json());
      this.app.use(cors());
      this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

      //* Routes
      this.app.use(this.router);

      //* Start the server
      this.app.listen(this.port, () => {
         console.log(`Server is running on port ${this.port}`);
      });

   }
}