import { Request, Response } from 'express';

import { BadRequestException, generatePassword, InternalServerError, NotFoundException } from '../../utils';
import { HandleJwt, HandlePassword, HandlePaypal, HandleQrCode, HandleSendEmaiL, IRepositoryMembership, IRepositoryUser, IRespositorySubscription } from '../../interfaces';
import { DTOcreatePlan, DTOcreateSubscription } from './DTO';
import { DTOCreateUser } from '../user';
import { IResSubscription, StatusEnum } from './types';

export class ControllerSubscription {

   constructor(
      private readonly handlePaypal: HandlePaypal,
      private readonly handleJwt: HandleJwt,
      private readonly handlePassword: HandlePassword,
      private readonly handleQrCode: HandleQrCode,
      private readonly handleEmailResend: HandleSendEmaiL,
      private readonly handleEmail: HandleSendEmaiL,
      private readonly repositoryUser: IRepositoryUser,
      private readonly respositoryMembership: IRepositoryMembership,
      private readonly repositorySubscription: IRespositorySubscription,
   ) { }

   public createPlan = async (req: Request, res: Response) => {
      try {
         const body = req.body
         const authHeader = req.headers.authorization;

         const validateData = DTOcreatePlan.create(body)
         console.log(validateData)

         // Validamos el id de la membresia
         const isMembership = await this.respositoryMembership.validateMembership(
            validateData.membership_id
         );

         if (!isMembership) {
            throw new BadRequestException(['La membresia no existe']);
         }

         // Verificar si existe un usuario 
         if (authHeader && authHeader.startsWith('Bearer ')) {
            const payload = this.handleJwt.decodeToken(authHeader.split(' ')[1])

            if (!payload) {
               throw new InternalServerError(
                  ['No es posible continuar con el pago', 'Error inesperado del servidor']
               )
            }

            const isUser = this.repositoryUser.validateUser(
               payload?.userId
            );

            if (!isUser) {
               throw new NotFoundException('El usuario no existe');
            }

            validateData.user_id = payload?.userId

         } else {
            const newPassword = generatePassword(12);
            const userValidateDate = DTOCreateUser.create({
               first_name: body.first_name,
               last_name: body.last_name,
               email: body.email,
               password: newPassword,
               is_confirmed: false,
               is_google_account: false,
               is_user_temp: true,
               is_active: true,
            });

            const newUser = await this.repositoryUser.create(
               userValidateDate
            );
            validateData.user_id = newUser.id;
         }

         if (!validateData.user_id) {
            throw new InternalServerError(
               ['No es posible continuar con el pago', 'Error inesperado del servidor']
            )
         }

         // Generamos un token de acceso usando la api de paypal
         const accessToken = await this.handlePaypal.getAccessToken();

         // Creamos el plan de membresias usando la api de paypal
         const newPlanId = await this.handlePaypal.createPlan(
            accessToken, {
            product_id: isMembership.service_id,
            interval_month: isMembership.duration_in_months,
            value: String(isMembership.price),
         });

         if (!newPlanId) {
            throw new NotFoundException('La membresias no existe');
         }

         const dateEnd = new Date()
         const dateStart = new Date(dateEnd.setMonth(
            dateEnd.getMonth() +
            isMembership.duration_in_months
         ));
         // Creamos la suscripcion
         const validateDataSub = DTOcreateSubscription.create({
            membership_end: dateEnd,
            membership_start: dateStart,
            plan_id: newPlanId,
            user_id: validateData.user_id,
            membership_id: isMembership.id,
            status: StatusEnum.PENDING,
         })

         const newSubscription = await this.repositorySubscription.createSubscription(
            validateDataSub
         )

         return res.status(201).json({
            message: 'Plan creado exitosamente',
            data: {
               planId: newSubscription.plan_id,
            }
         })
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
            })
         };

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            })
         };

         if (error instanceof InternalServerError) {
            return res.status(500).json({
               messages: error.messages
            })
         };

         return res.status(500).json({
            messages: ['Error inesperado del servidor']
         })
      }
   }

   public createSubscription = async (req: Request, res: Response) => {
      try {
         const planId = req.params.planId

         const accessToken = await this.handlePaypal.getAccessToken();

         const suscription = await this.repositorySubscription.getById(planId)

         if (!suscription) {
            throw new NotFoundException('La membresias no existe');
         }

         const newSubscription = await this.handlePaypal.createSubscription(
            accessToken, {
            email: suscription.user.email,
            fistName: suscription.user.first_name,
            lastName: suscription.user.last_name,
            planId: suscription.plan_id,
         });

         if (!newSubscription) {
            throw new InternalServerError(
               ['No es posible continuar con el pago', 'Error inesperado del servidor']
            )
         }

         await this.repositorySubscription.update(suscription.plan_id, {
            subscription_id: newSubscription,
         })

         return res.status(201).json({
            message: 'Plan creado exitosamente',
            data: {
               suscriptionId: newSubscription,
            }
         })

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
            })
         };

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            })
         };

         if (error instanceof InternalServerError) {
            return res.status(500).json({
               messages: error.messages
            })
         };
         return res.status(500).json({
            messages: ['Error inesperado del servidor']
         })
      }
   }

   public successfulSubscription = async (req: Request, res: Response) => {
      try {
         const planId = req.params.planId

         const subscription = await this.repositorySubscription.getById(planId)

         if (!subscription) {
            throw new NotFoundException('La membresias no existe');
         }
         const accessToken = await this.handlePaypal.getAccessToken()

         const checkSubscription = await this.handlePaypal.checkSubscription(accessToken, subscription.subscription_id!)

         if (!checkSubscription) {
            throw new InternalServerError(
               ['No es posible continuar con el pago', 'Error inesperado del servidor']
            )
         }

         if (checkSubscription.status != 'ACTIVE') {
            throw new InternalServerError(
               ['Ocurrio un error al momento de validar el pago', 'Error inesperado del servidor']
            )
         }

         await this.repositorySubscription.update(subscription.plan_id, {
            status: StatusEnum.ACTIVO,
         })

         // Generamos qr
         const { qrCode, code } = await this.handleQrCode.generateQrCode(4)


         if (subscription.user.is_user_temp) {
            const isSend = await this.sendEmails(subscription, qrCode, code, true)

            if (!isSend) {
               throw new InternalServerError(
                  ['No es posible continuar con el pago', 'Error inesperado del servidor']
               )
            }
            // hashear contraseña
            const hashedPassword = await this.handlePassword.hashPassword(subscription.user.password, 10)

            await this.repositoryUser.update(
               subscription.user.id, {
               password: hashedPassword
            })
         } else {
            const isSend = await this.sendEmails(subscription, qrCode, code, false)

            if (!isSend) {
               throw new InternalServerError(
                  ['No es posible continuar con el pago', 'Error inesperado del servidor']
               )
            }
         }

         return res.status(200).json({
            message: 'Pago exitoso',
         })

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
            })
         };

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            })
         }
         if (error instanceof InternalServerError) {
            return res.status(500).json({
               messages: error.messages
            })
         };
         return res.status(500).json({
            messages: ['Error inesperado del servidor']
         })
      }
   }

   public cancelSubscription = async (req: Request, res: Response) => {
      try {
         const planId = req.params.planId

         await this.repositorySubscription.update(
            planId, {
            status: StatusEnum.CANCELADO
         })

         return res.status(200).json({
            message: 'Suscripcion cancelada',
         })

      } catch (error) {
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            })
         };
         return res.status(500).json({
            messages: ['Error inesperado del servidor']
         })
      }
   }

   private async sendEmails(subscription: IResSubscription, qrCode: string, code: string, isUserTemp: boolean): Promise<boolean> {
      const { user } = subscription

      if (isUserTemp) {
         const sendEmailResend = await this.handleEmailResend.sendEmailmembers({
            name: user.first_name,
            codeAccess: code,
            qrCode: qrCode,
            email: user.email,
            password: user.password,
            pathHtml: 'email.subcription.user.ejs',
         })

         if (!sendEmailResend) {
            const sendEmail = await this.handleEmail.sendEmailmembers({
               name: user.first_name,
               codeAccess: code,
               qrCode: qrCode,
               email: user.email,
               password: user.password,
               pathHtml: 'email.subcription.user.ejs',
            })

            if (!sendEmail) {
               return false
            }
         }
         return true

      } else {
         const sendEmailResend = await this.handleEmailResend.sendEmailmembers({
            name: user.first_name,
            codeAccess: code,
            qrCode: qrCode,
            email: user.email,
            pathHtml: 'email.subcription.ejs',
         })

         if (!sendEmailResend) {
            const sendEmail = await this.handleEmail.sendEmailmembers({
               name: user.first_name,
               codeAccess: code,
               qrCode: qrCode,
               email: user.email,
               pathHtml: 'email.subcription.ejs',
            })

            if (!sendEmail) {
               return false
            }
         }
         return true
      }
   }
}
