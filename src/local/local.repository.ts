import { prisma } from "../data/postgres";
import { ILocalRepository } from "../interfaces/repositories";
import { BadRequestException } from "../utils";
import { IlocalAll, IlocalById, CreateLocalDTO, IlocalGeneric, UpdateLocalDTO } from "./local.DTO";

export class LocalRepository implements ILocalRepository {
   async getAll(services: string[], classes: string[], search: string, page: number, pagesize: number): Promise<IlocalAll> {

      const totalItems = await prisma.local.count({
         where: {
            isActivate: true,
         }
      });

      const localgetAll = await prisma.local.findMany({
         where: {
            isActivate: true,
            ...(services.length > 0 && { // spread condicional
               services: {
                  some: {
                     service: {
                        name: {
                           in: services,
                           mode: "insensitive"
                        }
                     }
                  }
               }
            }),
            ...(classes.length > 0 && {
               clases: {
                  some: {
                     class: {
                        name: {
                           in: classes,
                           mode: "insensitive"
                        }
                     }
                  }
               }
            }),
            ...(search && search.length > 0 && {
               name: {
                  contains: search,
                  mode: "insensitive"
               }
            }),
         },
         include: {
            images: {
               where: {
                  default: true,
               },
               select: {
                  image: true,
               },
               take: 1,
            },
         },
         skip: page,
         take: pagesize,
      });

      const result = localgetAll.map(({ images, ...local }) => {
         return {
            ...local,
            image: images?.[0]?.image,
         };
      });

      return {
         items: result.length,
         page: page,
         page_total: Math.ceil(totalItems / pagesize),
         locals: result
      }
   }
   async getById(id: number): Promise<IlocalById> {
      const local = await prisma.local.findUnique({
         where: {
            id: id
         },
         include: {
            clases: {
               select: {
                  class: {
                     select: {
                        id: true,
                        name: true
                     }
                  }
               }
            },
            services: {
               select: {
                  service: {
                     select: {
                        id: true,
                        name: true
                     }
                  }
               }
            },
            images: {
               select: {
                  id: true,
                  image: true,
                  default: true,
               }
            }
         }
      })

      if (!local) {
         throw new BadRequestException("Local no encontrado")
      }

      return {
         id: local.id,
         name: local.name,
         description: local.description,
         address: local.address,
         phone: local.phone,
         opening_start: local.opening_start,
         opening_end: local.opening_end,
         isActivate: local.isActivate,
         images: local.images,
         clases: local.clases.map(({ class: { name, id } }) => ({ name, id })),
         services: local.services.map(({ service: { name, id } }) => ({ name, id })),
         created_at: local.created_at,
         updated_at: local.updated_at,
      }
   }

   async create(data: CreateLocalDTO): Promise<IlocalGeneric> {
      const newLocalCreate = await prisma.$transaction(async () => {
         const newLocal = await prisma.local.create({
            data: {
               name: data.name,
               description: data.description,
               address: data.address,
               phone: data.phone,
               opening_start: data.opening_start,
               opening_end: data.opening_end,
               isActivate: data.isActivate,
            }
         });

         await prisma.localImages.createMany({
            data: data.images!.map((image, index) => {
               if (index === 0) {
                  return {
                     image: image,
                     default: true,
                     local_id: newLocal.id
                  }
               }
               return {
                  image: image,
                  default: false,
                  local_id: newLocal.id
               }
            })
         });

         if (data.services_id.length > 0) {
            await prisma.localService.createMany({
               data: data.services_id!.map((service) => {
                  return {
                     local_id: newLocal.id,
                     service_id: service
                  }
               })
            });
         }

         if (data.class_id.length > 0) {
            await prisma.localClass.createMany({
               data: data.class_id!.map((clase) => {
                  return {
                     local_id: newLocal.id,
                     class_id: clase
                  }
               })
            })
         }

         return newLocal
      })

      return newLocalCreate
   }
   async update(id: number, data: UpdateLocalDTO): Promise<{ updateLocal: IlocalGeneric; dataPastLocal: IlocalGeneric | null; }> {

      const updateLocal = await prisma.$transaction(async () => {
         const updateLocal = await prisma.local.update({
            where: {
               id: id
            },
            data: {
               name: data.name,
               description: data.description,
               address: data.address,
               phone: data.phone,
               opening_start: data.opening_start,
               opening_end: data.opening_end,
               isActivate: data.isActivate,
            },
         });

         // Crear nuevas imagenes
         if (data.images) {
            await prisma.localImages.createMany({
               data: data.images.map((image) => {
                  return {
                     image: image,
                     default: false,
                     local_id: updateLocal.id
                  }
               })
            })
         };

         // Actualizar una imagen como por defecto
         if (data.image_id_default) {
            await prisma.localImages.updateMany({
               where: {
                  local_id: id
               },
               data: {
                  default: false
               }
            });
            await prisma.localImages.update({
               where: {
                  id: data.image_id_default
               },
               data: {
                  default: true
               }
            });
         };

         // Eliminar las imagenes
         if (data.images_id_delete) {
            const deletedImages = await prisma.localImages.deleteMany({
               where: {
                  OR: data.images_id_delete.map((image) => {
                     return {
                        id: image
                     }
                  })
               }
            });
         };

         // Crear nuevos servicios
         if (data.services_id) {
            await prisma.localService.createMany({
               data: data.services_id.map((service) => {
                  return {
                     local_id: updateLocal.id,
                     service_id: service
                  }
               })
            })
         };

         // Eliminar los servicios del local
         if (data.services_id_delete) {
            await prisma.localService.deleteMany({
               where: {
                  OR: data.services_id_delete.map((service) => {
                     return {
                        id: service
                     }
                  })
               }
            });
         };

         // Crear nuevos clases
         if (data.class_id) {
            await prisma.localClass.createMany({
               data: data.class_id.map((clase) => {
                  return {
                     local_id: updateLocal.id,
                     class_id: clase
                  }
               })
            })
         };

         // Eliminar las clases del local
         if (data.class_id_delete) {
            await prisma.localClass.deleteMany({
               where: {
                  OR: data.class_id_delete.map((clase) => {
                     return {
                        id: clase
                     }
                  })
               }
            })
         }


         return updateLocal
      })


      return updateLocal
   }
   async deactivate(id: number): Promise<boolean> {
      throw new Error("Method not implemented.");
   }
   async delete(id: number): Promise<boolean> {
      throw new Error("Method not implemented.");
   }

}