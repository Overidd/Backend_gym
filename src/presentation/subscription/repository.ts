import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres";
import { IRespositorySubscription } from "../../interfaces";
import { DTOcreateSubscription, DTOupdateSubscription } from "./DTO";
import { NotFoundException } from "../../utils";
import { IResGenaral, IResSubscription, IUpdateSubscription, StatusEnum } from "./types";

export class RespositorySubscription implements IRespositorySubscription {
   async update(id: string | number, data: DTOupdateSubscription | IUpdateSubscription): Promise<IResGenaral> {
      try {
         const whereValue = typeof id === 'string'
            ? { plan_id: id as string }
            : { id: id as number };

         const update = await prisma.subscription.update({
            where: whereValue,
            data: {
               membership_end: data.membership_end,
               membership_start: data.membership_start,
               plan_id: data.plan_id,
               user_id: data.user_id,
               membership_id: data.membership_id,
               ...(data.status && { status: data.status as StatusEnum })
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
   async getById(id: string | number): Promise<IResSubscription | null> {
      try {
         const whereValue = typeof id === 'string'
            ? { plan_id: id as string }
            : { id: id as number };

         const subscription = await prisma.subscription.findFirst({
            where: whereValue,
            include: {
               user: {
                  select: {
                     id:true,
                     first_name: true,
                     last_name: true,
                     email: true,
                     is_user_temp:true,
                     password: true,
                  }
               }
            },
         });
         return subscription;
      } catch (error) {
         return null;
      }
   }
   async createSubscription(date: DTOcreateSubscription): Promise<IResGenaral> {
      try {
         const newSubcription = await prisma.subscription.create({
            data: {
               membership_end: date.membership_end,
               membership_start: date.membership_start,
               plan_id: date.plan_id,
               user_id: date.user_id,
               membership_id: date.membership_id,
               status: date.status,
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