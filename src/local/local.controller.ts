import { ILocalRepository } from "../interfaces/repositories";
import { Request, Response } from 'express';
import { BadRequestException, extractPublicIdFromUrl, NotFoundException, UnauthorizedException, uploadToCloudinary } from "../utils";
import { cloudinary } from "../config/cloudinary";
import { CreateLocalDTO, UpdateLocalDTO } from ".";

type queryString = {
   services: string[] | string,
   clases: string[] | string,
   search: string,
   page: string,
   pagesize: string
}

// category=alimento&category=juguete, Express lo agrupa en un array: ['alimento', 'juguete'].
export class LocalController {
   constructor(private readonly localRepository: ILocalRepository) { }

   getAll = async (req: Request, res: Response) => {
      try {
         let { services, clases, search, page = '1', pagesize = '10' }: queryString = req.query as queryString;

         if (typeof services === 'string') {
            services = [services]
         };

         if (typeof clases === 'string') {
            clases = [clases]
         };

         // const skitp: number = (parseInt(page) - 1) * parseInt(pagesize);

         const skitp: number = parseInt(page)
         const page_size: number = parseInt(pagesize);

         const locals = await this.localRepository.getAll(services, clases, search, skitp, page_size);

         return res.status(200).json({
            message: 'Listado de locales exitosamente',
            data: locals
         })

      } catch (error) {
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error.message
            })
         }
      };
   }

   getById = async (req: Request, res: Response) => {
      try {
         let { id } = req.params;

         const local = await this.localRepository.getById(parseInt(id));

         return res.status(200).json({
            message: 'Local listado exitosamente',
            data: local
         })
      } catch (error) {
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   };

   create = async (req: Request, res: Response) => {
      try {
         const data = req.body;
         const images = req.files as Express.Multer.File[];
         const dataDTO = CreateLocalDTO.create(data);
         if (!images || images.length === 0) {
            throw new BadRequestException('Debe subir al menos una imagen');
         }

         // Subir las images a cloudinary
         const imagesUrl = await Promise.all(
            images.map(async (image) => {
               const imageCloudinary = await uploadToCloudinary(image, 'local');
               return imageCloudinary.secure_url;
            })
         );

         // Asignar las images al DTO
         dataDTO.images = imagesUrl;

         const newLocal = await this.localRepository.create(dataDTO);

         return res.status(201).json({
            message: 'Nuevo local creado exitosamente',
            data: newLocal
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         }
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: 'No encontrado',
               error: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   };

   update = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const body = req.body;
         const images = req.files as Express.Multer.File[];

         console.log(body, 'body');
         const dataDTO = UpdateLocalDTO.update(body);
         console.log(dataDTO);

         if (images && images.length > 0) {
            const imagesUrl = await Promise.all(
               images.map(async (image) => {
                  const imageCloudinary = await uploadToCloudinary(image, 'local');
                  return imageCloudinary.secure_url;
               })
            );
   
            dataDTO.images = imagesUrl;
         }

         const updateLocal = await this.localRepository.update(parseInt(id), dataDTO);

         return res.status(200).json({
            message: 'Local updated successfully',
            data: updateLocal
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         }
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            })
         }
         console.log(error);
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error.message,
            })
         }
      }
   };

   updateImageDefault = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { image_id_default } = req.body;

         const imageDefault = await this.localRepository.updateImageDefault(parseInt(id), image_id_default);

         return res.status(200).json({
            message: 'Imagen asignado como por defecto exitosamente',
            data: imageDefault
         });

      } catch (error) {
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   };

   deleteImage = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { image_id } = req.body;

         if (!image_id) {
            throw new BadRequestException('Es requerido una ID imagen que este relacionado con un local');
         }
         if (typeof parseInt(image_id) !== 'number') {
            throw new BadRequestException('El id de image debe ser un numero');
         }

         const imageDelete = await this.localRepository.deleteImage(parseInt(id), parseInt(image_id));

         // Obtener el public id de una imagen
         const ImagePublicId = extractPublicIdFromUrl(imageDelete.image);
         // Eliminar la imagen de cloudinary
         const result = await cloudinary.uploader.destroy(ImagePublicId!);

         if (result.result !== 'ok') {
            res.status(200).json({
               message: 'La imagen se elimino exitosamente de la base de datos, pero ocurrio un error al eliminar la imagen de cloudinary',
               data: imageDelete
            })
         }
         return res.status(200).json({
            message: 'Imagen eliminada exitosamente',
            data: imageDelete
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         }
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            });
         };
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   }
   deleteService = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { service_id } = req.body;

         if (!service_id) {
            throw new BadRequestException('El servicio es requerido');
         };
         if (typeof parseInt(service_id) != 'number') {
            throw new BadRequestException('El id del service debe ser un número');
         };

         const serviceDelete = await this.localRepository.deleteService(parseInt(id), parseInt(service_id));

         return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: serviceDelete
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         }
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   };

   deleteClases = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { class_id } = req.body;

         if (!class_id) {
            throw new BadRequestException('la clase es requerido');
         }
         if (typeof parseInt(class_id) != 'number') {
            throw new BadRequestException('El id de la clase debe ser un número');
         }

         const classDelete = await this.localRepository.deleteClases(parseInt(id), parseInt(class_id));

         return res.status(200).json({
            message: 'Clase eliminada exitosamente',
            data: classDelete
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            })
         }
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   };

   isActivate = async (req: Request, res: Response) => {
      try {
         const { id } = req.params
         const localIsActivate = await this.localRepository.isActivate(parseInt(id));

         if (localIsActivate) {
            return res.status(200).json({
               message: 'Local activado',
               data: localIsActivate
            });
         }
         return res.status(200).json({
            message: 'Local desactivado',
            data: localIsActivate
         });
      } catch (error) {
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message
            });
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            });
         };
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error.message
            })
         }
      }
   };

   delete = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const localDelete = await this.localRepository.delete(parseInt(id));

         // Eliminara las imagenes de cloudinary
         if (localDelete.images) {
            for (const item of localDelete.images) {
               const publicId = extractPublicIdFromUrl(item.image)
               if (publicId) {
                  await cloudinary.uploader.destroy(publicId!)
               }
            }
         }

         return res.status(200).json({
            message: 'Local eliminado exitosamente',
            data: localDelete
         })
      } catch (error) {
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message
            });
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            });
         };
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
               error: error,
            })
         }
      }
   }
}