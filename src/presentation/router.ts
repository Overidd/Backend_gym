import { Router } from 'express'
import {ProductRouter} from './products/productRouter'

// Router Principal
export class AppRouter {

   static get router(): Router {

      const router = Router()
      router.use('/api/v1/product', ProductRouter.router)

      return router
   }
}