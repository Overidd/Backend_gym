import { Router } from 'express'
import {ProductRouter} from './products/product.router'

export class AppRouter {

   public static get router(): Router {
      const router = Router();

      const productRouter  = new ProductRouter()
      
      router.use('/api/v1/product', productRouter.router);

      return router
   }
}
