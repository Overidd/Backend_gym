import { Router } from 'express'

import { Paypal, JwtCustom, BcryptCustom } from '../../services'
import { UserRepository } from '../user'
import { RepositoryMembership } from '../membership/repository'
import { ControllerSubscription } from './controller'
import { RespositorySubscription } from './repository'
import { QrCode } from '../../services/qr.code'
import { EmailNodemailer } from '../../services/email'
import { EmailResend } from '../../services/email.resend'

export class RouterSubscription {
   public get router(): Router {
      const router = Router()
      const repositoryMembership = new RepositoryMembership()
      const repositoryUser = new UserRepository()
      const repositorySubscription = new RespositorySubscription()
      const servicePaypal = new Paypal()

      const controller = new ControllerSubscription(
         servicePaypal,
         JwtCustom,
         BcryptCustom,
         QrCode,
         EmailNodemailer,
         EmailResend,
         repositoryUser,
         repositoryMembership,
         repositorySubscription,
      )

      router.post('/create/plan', controller.createPlan)

      router.post('/success/:suscripcionId', controller.successfulSubscription)

      router.get('/cancel/:planId', controller.cancelSubscription)

      return router
   }
}