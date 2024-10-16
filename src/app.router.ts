import { Router } from 'express'
import {ProductRouter} from './presentation/products/product.router'
import { TrainerRouter } from './presentation/trainer';
import { LocalRouter } from './presentation/local';
import { LocalClaseRouter, LocalServiceRouter } from './presentation/local.services';

export class AppRouter {

   public static get router(): Router {
      const router = Router();

      const productRouter  = new ProductRouter()
      const trainerRouter = new TrainerRouter()
      const localRouter = new LocalRouter()
      const localServiceRouter = new LocalServiceRouter()
      const localClaseRouter = new LocalClaseRouter()

      
      router.use('/api/v1/product', productRouter.router);

      router.use('/api/v1/trainer', trainerRouter.router);

      router.use('/api/v1/local', localRouter.router);

      router.use('/api/v1/service', localServiceRouter.router);

      router.use('/api/v1/clase', localClaseRouter.router);

      return router
   }
}
