import { Prisma } from "@prisma/client";
import { prisma } from "../../data/postgres";
import { ILocalRepository } from "../../interfaces/repositories";
import { BadRequestException, NotFoundException } from "../../utils";
import { ILocalAll, ILocalById, CreateLocalDTO, UpdateLocalDTO, ILocalImages, ILocalDelete, ILocalGeneric, ILocalLocation } from ".";

export class LocalRepository implements ILocalRepository {
   async getAllLocation(): Promise<ILocalLocation[]> {
      return await prisma.localLocation.findMany({
         select: {
            id: true,
            address: true,
            city: true,
            country: true,
            latitude: true,
            longitude: true,
            zip_code: true,
         }
      })
   };

   async getAll(services: string[], clases: string[], search: string[], page: number, pagesize: number): Promise<ILocalAll> {

      const totalItems = await prisma.local.count({
         where: {
            isActivate: true,
         }
      });

      const localgetAll = await prisma.local.findMany({
         where: {
            isActivate: true,
            ...(services?.length > 0 && { // spread condicional
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
            ...(clases?.length > 0 && {
               clases: {
                  some: {
                     class: {
                        name: {
                           in: clases,
                           mode: "insensitive"
                        }
                     }
                  }
               }
            }),
            ...(search.length > 0 && {
               location: {
                  some: {
                     OR: search.map(term => ({
                        OR: [
                           {
                              address: {
                                 contains: term,
                                 mode: "insensitive"
                              }
                           },
                           {
                              city: {
                                 contains: term,
                                 mode: "insensitive"
                              }
                           },
                           {
                              country: {
                                 contains: term,
                                 mode: "insensitive"
                              }
                           },
                           {
                              zip_code: {
                                 contains: term,
                                 mode: "insensitive"
                              }
                           }
                        ]
                     }))
                  }
               }
            })
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
            location: {
               select: {
                  address: true,
                  city: true,
                  country: true,
               }
            }
         },
         skip: (page - 1) * pagesize,
         take: pagesize,
      });

      const result = localgetAll.map(({ images, ...local }) => {
         return {
            ...local,
            opening_start: local.opening_start.toISOString().substring(11, 19),
            opening_end: local.opening_end.toISOString().substring(11, 19),
            image: images?.[0]?.image,
            location: local.location[0],
         };
      });

      return {
         items: result.length,
         page: page,
         page_total: Math.ceil(totalItems / pagesize),
         locals: result
      }
   }
   async getById(id: number): Promise<ILocalById> {
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
                        icon: true,
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
                        icon: true,
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
            },
            location: {
            }
         }
      })

      if (!local) {
         throw new NotFoundException("Local no encontrado")
      }
      return {
         id: local.id,
         name: local.name,
         description: local?.description ?? null,
         phone: local.phone,
         opening_start: local.opening_start.toISOString().substring(11, 19),
         opening_end: local.opening_end.toISOString().substring(11, 19),
         isActivate: local.isActivate,
         location: local.location[0],
         images: local.images,
         clases: local.clases.map(clase => clase.class),
         services: local.services.map(service => service.service),
         created_at: local.created_at,
         updated_at: local.updated_at,
      }
   }

   async create(data: CreateLocalDTO): Promise<ILocalGeneric> {
      try {
         const { newLocal, newLocalClasses, newLocalImages, newLocalServices, newLocation }
            = await prisma.$transaction(async (prisma) => {
               const newLocal = await prisma.local.create({
                  data: {
                     name: data.name,
                     description: data.description,
                     phone: data.phone,
                     opening_start: data.opening_start,
                     opening_end: data.opening_end,
                     isActivate: data.isActivate,
                  }
               });

               const newLocalImages = await prisma.localImages.createMany({
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

               const newLocation = await prisma.localLocation.create({
                  data: {
                     local_id: newLocal.id,
                     address: data.address,
                     city: data.city,
                     country: data.country,
                     zip_code: data.zip_code,
                     latitude: data.latitude,
                     longitude: data.longitude,
                  }
               })

               const newLocalServices = await prisma.localService.createMany({
                  data: data.services_id!.map((service) => {
                     return {
                        local_id: newLocal.id,
                        service_id: service
                     }
                  }),
               });

               const newLocalClasses = await prisma.localClass.createMany({
                  data: data.class_id!.map((clase) => {
                     return {
                        local_id: newLocal.id,
                        class_id: clase
                     }
                  })
               })

               return {
                  newLocal,
                  newLocalImages,
                  newLocalServices,
                  newLocalClasses,
                  newLocation,
               }
            })

         return {
            ...newLocal,
            location: newLocation,
            images: newLocalImages,
            clases: newLocalClasses,
            services: newLocalServices,
            created_at: newLocal.created_at,
            updated_at: newLocal.updated_at,
         }
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException('Los servicios o clases seleccionados no existe');
            };
         };
         throw new Error('Error inesperado al crear el local');
      }
   }

   async validateService(id: number): Promise<boolean> {
      try {
         const service = await prisma.serviceGym.findUnique({
            where: {
               id: id
            }
         })

         if (!service) {
            throw new NotFoundException(`El servicio con el id ${id} no existe`);
         }
         return true
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException(`El servicio con el id ${id} no existe`);
            };
         };
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado al validar el servicio');
      }
   }

   async validateClass(id: number): Promise<boolean> {
      try {
         const clase = await prisma.classGym.findUnique({
            where: {
               id: id
            }
         })
         if (!clase) {
            throw new NotFoundException(`La clase con el id ${id} no existe`);
         }
         return true
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2003') {
               throw new NotFoundException(`La clase con el id ${id} no existe`);
            };
         };
         if (error instanceof NotFoundException) {
            throw new NotFoundException(error.message);
         }
         throw new Error('Error inesperado al validar la clase');
      }
   }

   async update(id: number, data: UpdateLocalDTO): Promise<ILocalGeneric> {
      try {
         // const local = await prisma.local.findUnique({
         //    where: {
         //       id: id
         //    }
         // })

         // // Verificar el horario
         // if (data.opening_start) {
         //    if (local?.opening_end! < data.opening_start) {
         //       throw new BadRequestException("El horario de apertura no puede ser mayor al horario de cierre");
         //    }
         // };

         // if (data.opening_end) {
         //    if (local?.opening_start! > data.opening_end) {
         //       throw new BadRequestException("El horario de cierre no puede ser menor al horario de apertura");
         //    }
         // }
         const {
            updateLocal,
            newLocalImages,
            newLocalClasses,
            newLocalServices,
            updateLocation,
         }
            = await prisma.$transaction(async (prisma) => {
               const updateLocal = await prisma.local.update({
                  where: {
                     id: id
                  },
                  data: {
                     name: data.name,
                     description: data.description,
                     phone: data.phone,
                     opening_start: data.opening_start,
                     opening_end: data.opening_end,
                     isActivate: data.isActivate,
                  },
               });

               const updateLocation = await prisma.localLocation.update({
                  where: {
                     local_id: id,
                  },
                  data: {
                     address: data.address,
                     latitude: data.latitude,
                     longitude: data.longitude,
                     city: data.city,
                     country: data.country,
                  },
               })
               // Crear nuevas imagenes
               const newLocalImages = await prisma.localImages.createMany({
                  data: data.images?.map((image) => {
                     return {
                        image: image,
                        default: false,
                        local_id: id
                     }
                  }) || []
               })

               // Crear nuevos servicios
               const newLocalServices = await prisma.localService.createMany({
                  data: data.services_id?.map((service) => {
                     return {
                        local_id: id,
                        service_id: service
                     }
                  }) || []
               });

               // Crear nuevos clases
               const newLocalClasses = await prisma.localClass.createMany({
                  data: data.class_id?.map((clase) => {
                     return {
                        local_id: id,
                        class_id: clase
                     }
                  }) || []
               })

               return {
                  updateLocal,
                  newLocalImages,
                  newLocalServices,
                  newLocalClasses,
                  updateLocation,
               }
            })

         return {
            ...updateLocal,
            opening_start: updateLocal.opening_start.toISOString().substring(11, 19),
            opening_end: updateLocal.opening_end.toISOString().substring(11, 19),
            location: updateLocation,
            images: newLocalImages,
            clases: newLocalClasses,
            services: newLocalServices,
            created_at: updateLocal.created_at,
            updated_at: updateLocal.updated_at,
         }
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No existe el local')
            }
            if (error.code === 'P2003') {
               throw new NotFoundException('Los servicios o clases seleccionados no existe');
            };
         }
         throw new Error('Error inesperado al momento de actualizar el local');
      }
   }
   async updateImageDefault(id: number, image_id_default: number): Promise<ILocalImages> {
      try {
         const updateImageDefault = await prisma.localImages.update({
            where: {
               id: image_id_default
            },
            data: {
               default: true
            }
         });

         await prisma.localImages.updateMany({
            where: {
               local_id: id,
               NOT: {
                  id: updateImageDefault.id,
               },
            },
            data: {
               default: false
            },
         });

         return updateImageDefault

      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No existe la imagen relacionado con el local')
            }
         }
         throw new Error('Error inesperado');
      }
   }
   async deleteImage(id: number, image_id: number): Promise<ILocalImages> {
      try {
         const deleteImage = await prisma.localImages.delete({
            where: {
               local_id: id,
               id: image_id,
            }
         })
         return deleteImage

      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new BadRequestException('No existe la imagen relacionado con el local')
            }
         }

         throw new Error('Error inesperado al eliminar la imagen');
      }
   }

   async deleteService(id: number, service_id: number): Promise<boolean> {
      try {
         await prisma.localService.deleteMany({
            where: {
               local_id: id,
               service_id: service_id,
            },
         });

         return true
      } catch (error) {
         throw new Error('Error inesperado al eliminar los servicios');
      }
   }

   async deleteClases(id: number, class_id: number): Promise<boolean> {
      try {
         await prisma.localClass.deleteMany({
            where: {
               local_id: id,
               class_id: class_id
            }
         })

         return true
      } catch (error) {
         throw new Error('Error inesperado al eliminar las clases');
      }
   }
   async isActivate(id: number): Promise<boolean> {
      try {
         const local = await prisma.local.findUnique({
            where: {
               id: id,
            }
         })
         const localIsActivate = await prisma.local.update({
            where: {
               id: id,
            },
            data: {
               isActivate: !local?.isActivate
            }
         })
         return localIsActivate.isActivate
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
               throw new NotFoundException('No existe el local')
            }
         }
         throw new Error('Error inesperado al desactivar el local');
      }
   }
   async delete(id: number): Promise<ILocalDelete> {
      try {
         const deleteLocal = await prisma.local.delete({
            where: {
               id: id,
            },
            include: {
               images: {
                  select: {
                     image: true,
                  }
               }
            }
         });
         return deleteLocal
      } catch (error) {
         // Verificar si el error es un P2025 (registro no encontrado)
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new NotFoundException('No se encontró ningún local para eliminar');
         }

         throw new Error('Error inesperado al eliminar el local');
      }
   }
}