import { Router } from 'express'
import productRouter from './products/productRouter'

// Router Principal
export class AppRouter {

   static get router(): Router {

      const router = Router()
      router.get('/api/product', productRouter)

      return router
   }
}