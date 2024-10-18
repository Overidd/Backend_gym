import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres";
import { ILocalServiceRepository } from "../../interfaces";
import { NotFoundException } from "../../utils";
import { IServices, LocalServiceDTO } from ".";

export class ClasesRepository implements ILocalServiceRepository {
   async getAll(): Promise<IServices[]> {
      const classgymAll = await prisma.classGym.findMany()
      return classgymAll
   }
   async create(data: LocalServiceDTO): Promise<IServices> {
      try {
         const newClase = await prisma.classGym.create({
            data: {
               name: data.name!,
               icon: data.icon!,
            }
         });

         return newClase
      } catch (error) {
         throw new Error('Error inesperado del servidor');
      }
   }
   async update(id: number, data: LocalServiceDTO): Promise<{ update: IServices, dataPast: IServices }> {
      try {
         const dataClasePast = await prisma.classGym.findUnique({
            where: {
               id: id
            }
         });

         if (!dataClasePast) {
            throw new NotFoundException('No se encontro la clase');
         }

         const updateClase = await prisma.classGym.update({
            where: {
               id: id
            },
            data: {
               name: data.name,
               icon: data.icon,
            }
         })

         return { update: updateClase, dataPast: dataClasePast }
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No se encontro la clase');
            }
         }
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado del servidor');
      }
   }
   async delete(id: number, is_delete_definitive: boolean): Promise<IServices> {
      try {
         if (is_delete_definitive) {
            const deleteClase = await prisma.classGym.delete({
               where: {
                  id: id
               }
            })
            return deleteClase
         }
         const clasesCount = await prisma.localClass.count({
            where: {
               class_id: id
            },

         });
         if (clasesCount > 0) {
            const localesText = clasesCount === 1 ? 'local está' : 'locales están';
            throw new NotFoundException(`No es posible eliminar la clase, ${clasesCount} ${localesText} haciendo uso`);
         }

        const deleteClase = await prisma.classGym.delete({
            where: {
               id: id
            }
         })
         return deleteClase
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No se encontro la clase para eliminar');
            }
         }
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado del servidor');
      }
   }
}

export class ServiceRepository implements ILocalServiceRepository {
   async getAll(): Promise<IServices[]> {
      const servicegymAll = await prisma.serviceGym.findMany()
      return servicegymAll
   }

   async create(data: LocalServiceDTO): Promise<IServices> {
      try {
         const newService = await prisma.serviceGym.create({
            data: {
               name: data.name!,
               icon: data.icon!,
            }
         });

         return newService
      } catch (error) {
         throw new Error('Error inesperado del servidor');
      }
   }
   async update(id: number, data: LocalServiceDTO): Promise<{ update: IServices, dataPast: IServices }> {
      try {
         const dataClasePast = await prisma.serviceGym.findUnique({
            where: {
               id: id
            }
         });

         if (!dataClasePast) {
            throw new NotFoundException('No se encontro el servicio');
         }
         const updateService = await prisma.serviceGym.update({
            where: {
               id: id
            },
            data: {
               name: data.name,
               icon: data.icon,
            }
         })

         return { update: updateService, dataPast: dataClasePast }
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No se encontro el servicio');
            }
         }
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado del servidor');
      }
   }
   async delete(id: number, is_delete_definitive: boolean): Promise<IServices> {
      try {
         if (is_delete_definitive) {
            const deleteService = await prisma.serviceGym.delete({
               where: {
                  id: id
               }
            })
            return deleteService
         }
         const serviceCount = await prisma.localService.count({
            where: {
               service_id: id
            }
         });
         if (serviceCount > 0) {
            const localesText = serviceCount === 1 ? 'local está' : 'locales están';
            throw new NotFoundException(`No es posible eliminar el servicio, ${serviceCount} ${localesText} haciendo uso`);
         }

         const deleteService = await prisma.serviceGym.delete({
            where: {
               id: id
            }
         })
         return deleteService
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No se encontro el servicio para eliminar');
            }
         }
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado del servidor');
      }
   }
}