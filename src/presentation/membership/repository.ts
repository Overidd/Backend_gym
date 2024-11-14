import { Prisma } from "@prisma/client";

import { IRepositoryMembership } from "../../interfaces";
import { BadRequestException } from "../../utils";
import { prisma } from "../../data/postgres";
import { IResGenaral } from "./types";
import { DTOMembership } from "./DTO";

export class RepositoryMembership implements IRepositoryMembership {
   async validateMembership(id: string): Promise<IResGenaral | null> {
      try {
         const membership = await prisma.membership.findUnique({
            where: {
               id: id
            },
         })
         return membership
      } catch (error) {
         throw new Error('Error inesperado del servidor');
      }
   }
   async getAll(): Promise<IResGenaral[]> {
      const memberships = await prisma.membership.findMany({
         where: {
            status: true
         }
      });

      return memberships
   }
   async create(data: DTOMembership, serviceId: string): Promise<IResGenaral> {
      try {
         let priceTotal = undefined
         if (data.discount && data.discount > 0) {
            priceTotal = data.price! - (data.price! * data.discount / 100)
         }

         const newMembership = await prisma.membership.create({
            data: {
               duration_in_months: data.duration_in_months!,
               name: data.name!,
               price: data.price!,
               description: data.description!,
               discount: data.discount,
               price_total: priceTotal,
               status: data.status!,
               service_id: serviceId,
            },
         })

         return newMembership
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
               throw new BadRequestException(['El plan ya existe', 'Elige otra duracion mensual']);
            }
         }
         throw new Error('Error inesperado del servidor')
      }
   }
   async update(id: string, data: DTOMembership, serviceId?: string): Promise<IResGenaral> {
      try {

         let priceTotal = undefined
         if (data.discount && data.discount > 0) {
            priceTotal = data.price! - (data.price! * data.discount / 100)
         }

         const isMembershipExist = await this.validateMembership(id)
         if (!isMembershipExist) {
            throw new BadRequestException(['No existe el plan']);
         }
         if (isMembershipExist?.status === false) {
            throw new BadRequestException(['El plan esta inactivo']);
         }
         const updateMembership = prisma.membership.update({
            where: {
               id: isMembershipExist?.id,
            },
            data: {
               duration_in_months: data.duration_in_months!,
               name: data.name,
               price: data.price,
               price_total: priceTotal,
               description: data.description,
               discount: data.discount,
               service_id: serviceId,
            },
         })

         return updateMembership
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new BadRequestException('No existe el plan')
            }
         }

         if (error instanceof BadRequestException) {
            throw new BadRequestException(error.messages);
         }

         throw new Error('Error inesperado del servidor')
      }

   }
}