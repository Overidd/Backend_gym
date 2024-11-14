import { Request, Response } from 'express';

import { HandleJwt, HandlePassword, HandlePaypal, HandleQrCode, HandleSendEmaiL, IRepositoryMembership, IRepositoryUser, IRespositorySubscription } from '../../interfaces';
import { BadRequestException, InternalServerError, NotFoundException } from '../../utils';
import { DTOcreatePlan, DTOcreateSubscription, DTOupdatePlan } from './DTO';
import { DTOCreateUser, IResUserTemp } from '../user';
import { StatusEnum } from './types';

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
         const validateData = DTOcreatePlan.create(body)

         // Validamos el id de la membresia
         const isMembership = await this.respositoryMembership.validateMembership(
            validateData.membership_id
         );

         if (!isMembership) {
            throw new BadRequestException(['La membresia no existe']);
         }

         // Generamos un token
         const accessToken = await this.handlePaypal.getAccessToken();

         // Creamos el plan en paypal
         const newPlanId = await this.handlePaypal.createPlan(
            accessToken, {
            product_id: isMembership.service_id,
            interval_month: isMembership.duration_in_months,
            value: String(isMembership.price),
         });

         if (!newPlanId) {
            throw new BadRequestException(['Error al crear el plan de membresias']);
         }

         validateData.plan_id = newPlanId;
         validateData.status = StatusEnum.PENDING;

         // Creamos el plan
         const newPlan = await this.repositorySubscription.cratePlan(validateData)

         if (!newPlanId) {
            throw new NotFoundException('La membresias no existe');
         }

         return res.status(201).json({
            message: 'Plan creado exitosamente',
            planId: newPlan.plan_id,
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
         const suscripcionId = req.params.suscripcionId;
         const authHeader = req.headers.authorization;
         const body = req.body;

         // Obtener token de acceso
         const accessToken = await this.handlePaypal.getAccessToken();

         // Verificar suscripción
         const checkSubscription = await this.handlePaypal.checkSubscription(accessToken, suscripcionId);
         this.validateSubscription(checkSubscription);

         // Obtener el plan
         const plan = await this.repositorySubscription.getByIdPlan(checkSubscription!.plan_id);
         if (!plan) throw new BadRequestException('La membresía no existe');

         // Calcular fechas de suscripción
         const { dateStart, dateEnd } = this.calculateSubscriptionDates(plan);

         // Generar código de acceso y QR
         const { code, qrCode } = await this.handleQrCode.generateQrCode(4);

         // Crear datos de suscripción
         const validateDataSub = DTOcreateSubscription.create({
            membership_end: dateEnd,
            membership_start: dateStart,
            access_code: code,
            subscription_id: checkSubscription!.id,
            plan_id: plan.id,
            status: StatusEnum.PAGADO,
            user_id: undefined,
         });

         // Obtener o crear usuario
         const user = await this.getOrCreateUser(authHeader, body);
         validateDataSub.user_id = user.id;

         // Crear suscripción
         await this.repositorySubscription.createSubscription(validateDataSub);

         // Enviar correos electrónicos
         const sendEmail = await this.sendEmails(user, qrCode, code)

         if (!sendEmail) throw new BadRequestException('Error al enviar el correo');

         // Actualizar usuario temporal
         if (user.is_user_temp) await this.updateTempUserToPermanent(user);

         return res.status(201).json({ message: 'Pago exitoso' });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
            });
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message
            });
         }
         if (error instanceof InternalServerError) {
            return res.status(500).json({
               messages: error.messages
            });
         }
         console.log(error, 'error');

         return res.status(500).json({
            messages: ['Error inesperado del servidor']
         });
      }
   };

   private validateSubscription(checkSubscription: any) {
      if (!checkSubscription || checkSubscription.status !== 'ACTIVE') {
         throw new InternalServerError(['No es posible continuar con el pago', 'Error inesperado del servidor']);
      }
   }

   private calculateSubscriptionDates(plan: any) {
      const dateEnd = new Date();
      const dateStart = new Date(dateEnd.setMonth(dateEnd.getMonth() + plan.membership?.duration_in_months!));
      return { dateStart, dateEnd };
   }

   // Función para obtener o crear usuario
   private async getOrCreateUser(authHeader: string | undefined, body: any) {
      if (authHeader && authHeader.startsWith('Bearer ')) {
         const token = authHeader.split(' ')[1];
         const payload = this.handleJwt.decodeToken(token);
         if (payload) {
            const user = await this.repositoryUser.validateUser(payload.userId);
            if (user) return user;
         }
      }
      const user = await this.repositoryUser.validateUser(undefined, body.email);

      if (!user) {
         const validateDataUser = DTOCreateUser.create(
            { ...body, is_user_temp: true }, undefined, true
         );

         return await this.repositoryUser.create(validateDataUser);
      }
      return user
   }

   // Función para actualizar usuario temporal a permanente
   private async updateTempUserToPermanent(user: IResUserTemp) {
      console.log(user, 'user');
      const hashedPassword = await this.handlePassword.hashPassword(user.password!, 10);

      await this.repositoryUser.update(user.id, { password: hashedPassword, is_user_temp: false });
   }

   private async sendEmails(user: IResUserTemp, qrCode: string, code: string): Promise<boolean> {
      if (user.is_user_temp) {
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

   public cancelSubscription = async (req: Request, res: Response) => {
      try {
         const planId = req.params.planId

         const validateData = DTOupdatePlan.update({ status: StatusEnum.CANCELADO })

         await this.repositorySubscription.updatePlan(planId, validateData)

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
}
