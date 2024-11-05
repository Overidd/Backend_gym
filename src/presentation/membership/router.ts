import {Router} from 'express'
import { ControllerMembership } from './controller'
import { RepositoryMembership } from './repository'

export class RouterMembership {

   public get router(): Router {
      const router = Router()
      const repository = new RepositoryMembership()
      const controller = new ControllerMembership(repository)

      router.get('/all', controller.getAll)

      router.post('/create', controller.create)

      router.put('/update/:id', controller.update)

      return router
   }
}