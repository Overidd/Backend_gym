import { Router } from 'express'
import {ProductRouter} from './products/product.router'
import { TrainerRouter } from './trainer';

export class AppRouter {

   public static get router(): Router {
      const router = Router();

      const productRouter  = new ProductRouter()
      const trainerRouter = new TrainerRouter()
      
      router.use('/api/v1/product', productRouter.router);

      router.use('/api/v1/trainer', trainerRouter.router);

      return router
   }
}
