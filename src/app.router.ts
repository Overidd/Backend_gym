import { Router } from 'express'
import {ProductRouter} from './presentation/products/product.router'
import { TrainerRouter } from './presentation/trainer';
import { LocalRouter } from './presentation/local';
import { LocalClaseRouter, LocalServiceRouter } from './presentation/local.services';
import { RouterMembership } from './presentation/membership';
import { RouterSubscription } from './presentation/subscription/router';

export class AppRouter {

   public static get router(): Router {
      const router = Router();

      const productRouter  = new ProductRouter()
      const trainerRouter = new TrainerRouter()
      const localRouter = new LocalRouter()
      const localServiceRouter = new LocalServiceRouter()
      const localClaseRouter = new LocalClaseRouter()
      const routerMembership = new RouterMembership()
      const routerSubscription = new RouterSubscription()

      
      router.use('/api/v1/product', productRouter.router);

      router.use('/api/v1/trainer', trainerRouter.router);

      router.use('/api/v1/local', localRouter.router);

      router.use('/api/v1/service', localServiceRouter.router);

      router.use('/api/v1/clase', localClaseRouter.router);

      router.use('/api/v1/membership', routerMembership.router);

      router.use('/api/v1/subscription', routerSubscription.router);

      return router
   }
}
