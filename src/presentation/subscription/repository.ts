import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres";

import { IRespositorySubscription } from "../../interfaces";
import { DTOcreatePlan, DTOcreateSubscription, DTOupdatePlan, DTOupdateSubscription } from "./DTO";
import { IResGenaral, IResPlan, IResSubscription, IUpdateSubscription } from "./types";
import { NotFoundException } from "../../utils";

export class RespositorySubscription implements IRespositorySubscription {
   async update(id: number, data: DTOupdateSubscription | IUpdateSubscription): Promise<IResGenaral> {
      try {
         const update = await prisma.subscription.update({
            where: {
               id: id as number
            },
            data: {
               membership_end: data.membership_end,
               membership_start: data.membership_start,
               user_id: data.user_id,
               access_code: data.access_code,
               is_active: data.is_active,
               plans_id: data.plan_id,
               subscription_id: data.subscription_id,
            }
         })

         return update
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException(`La suscripcion con no existe`);
            }
         }
         throw new Error();
      }
   }
   async getByIdPlan(id: string): Promise<IResPlan | null> {
      try {
         const plan = await prisma.plans.findUnique({
            where: {
               plan_id: id as string
            },
            include: {
               membership: {
                  select: {
                     duration_in_months: true
                  }
               }
            }
         })

         return plan
      } catch (error) {
         throw new Error();
      }
   }
   async cratePlan(data: DTOcreatePlan): Promise<IResPlan> {
      try {
         const newPlan = await prisma.plans.create({
            data: {
               plan_id: data.plan_id!,
               email: data.email,
               status: data.status!,
               membership_id: data.membership_id
            }
         })
         return newPlan
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
               throw new NotFoundException(`El plan con el id ${data.plan_id} ya existe`);
            }
         }
         throw new Error("Method not implemented.");
      }

   }
   async updatePlan(id: number | string, data: DTOupdatePlan): Promise<IResPlan> {
      try {
         const whereId = typeof id === 'number'
            ? { id: id as number }
            : { plan_id: id as string };

         const update = await prisma.plans.update({
            where: whereId,
            data: {
               email: data.email,
               status: data.status,
               plan_id: data.plan_id,
               membership_id: data.membership_id,
            }
         })

         return update
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException(`La suscripcion con no existe`);
            }
         }
         throw new Error();
      }
   }
   async getById(_id: string | number): Promise<IResSubscription | null> {
      throw new Error();
   }
   async createSubscription(date: DTOcreateSubscription): Promise<IResGenaral> {
      try {
         const newSubcription = await prisma.subscription.create({
            data: {
               membership_end: date.membership_end,
               membership_start: date.membership_start,
               plans_id: date.plan_id!,
               user_id: date.user_id!,
               access_code: date.access_code,
               subscription_id: date.subscription_id,
               is_active: true,
            }
         })
         return newSubcription
      } catch (error) {
         throw new Error('Error inesperado del servidor');
      }
   }
   successfulSubscription(_id: string): Promise<any> {
      throw new Error("Method not implemented.");
   }
   cancelSubscription(_id: string): Promise<any> {
      throw new Error("Method not implemented.");
   }
}