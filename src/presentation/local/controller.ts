import { Request, Response } from 'express';
import { BadRequestException, NotFoundException, UnauthorizedException, validateArray, validateId } from "../../utils";
import { CreateLocalDTO, queryString, UpdateLocalDTO } from ".";
import { HandlerImage, ILocalRepository } from '../../interfaces';

// category=alimento&category=juguete, Express lo agrupa en un array: ['alimento', 'juguete'].
export class LocalController {
   constructor(
      private readonly localRepository: ILocalRepository,
      private readonly handlerImage: HandlerImage,
   ) { }

   getAll = async (req: Request, res: Response) => {
      try {
         let { services, clases, search, page = '1', pagesize = '10' }: queryString = req.query as queryString;

         const normalizedServices = validateArray(services);
         const normalizedClases = validateArray(clases);

         const skitp: number = parseInt(page) ? parseInt(page) : 1
         const page_size: number = parseInt(pagesize) ? parseInt(pagesize) : 10

         const locals = await this.localRepository.getAll(normalizedServices, normalizedClases, search, skitp, page_size);

         return res.status(200).json({
            message: 'Listado de locales exitosamente',
            data: locals
         })

      } catch (error) {
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado del servidor',
            })
         }
      };
   }

   getById = async (req: Request, res: Response) => {
      try {
         let { id } = req.params;

         const idParsed = validateId(id);

         const local = await this.localRepository.getById(idParsed);

         return res.status(200).json({
            message: 'Local listado exitosamente',
            data: local
         })
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               message: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado del servidor',
            })
         }
      }
   };

   create = async (req: Request, res: Response) => {
      try {
         const data = req.body;
         const images = req.files as Express.Multer.File[];
         const dataDTO = CreateLocalDTO.create(data);

         if (!images || images.length === 0) throw new BadRequestException(['Es necesario subir al menos una imagen']);

         // Subir las images a cloudinary
         const imagesUrl = await this.handlerImage.uploadImages(images, 'local')

         // Asignar las images al DTO
         dataDTO.images = imagesUrl

         const newLocal = await this.localRepository.create(dataDTO);

         return res.status(201).json({
            message: 'Local creado exitosamente',
            data: newLocal
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
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
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado del servidor',
            })
         }
      }
   };

   update = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const body = req.body;
         const images = req.files as Express.Multer.File[];

         const idParsed = validateId(id);

         const dataDTO = UpdateLocalDTO.update(body);

         if (images && images.length > 0) {
            const imagesUrl = await this.handlerImage.uploadImages(images, 'local')

            dataDTO.images = imagesUrl;
         }

         const updateLocal = await this.localRepository.update(idParsed, dataDTO);

         return res.status(200).json({
            message: 'Local actualizado exitosamente',
            data: updateLocal
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
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
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
            })
         }
      }
   };

   updateImageDefault = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { image_id_default } = req.body;
         const idParsed = validateId(id);

         const imageDefault = await this.localRepository.updateImageDefault(idParsed, image_id_default);

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
            })
         }
      }
   };

   deleteImage = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { image_id } = req.body;

         const idParsed = validateId(id);

         if (!image_id) {
            throw new BadRequestException(['Es requerido seleccionar una imagen']);
         }
         if (typeof parseInt(image_id) !== 'number') {
            throw new BadRequestException(['El id de image debe ser un numero']);
         }

         const imageDelete = await this.localRepository.deleteImage(idParsed, parseInt(image_id));

         // Eliminar la imagen de cloudinary
         await this.handlerImage.deleteImage(imageDelete.image);

         return res.status(200).json({
            message: 'Imagen eliminada exitosamente',
            data: imageDelete
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
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
            })
         }
      }
   }
   deleteService = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { service_id } = req.body;
         const idParsed = validateId(id);

         if (!service_id) {
            throw new BadRequestException(['Es requerido seleccionar un servicio']);
         };
         if (typeof parseInt(service_id) != 'number') {
            throw new BadRequestException(['El id del service debe ser un número']);
         };

         const serviceDelete = await this.localRepository.deleteService(idParsed, parseInt(service_id));

         return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: serviceDelete
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
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
            })
         }
      }
   };

   deleteClases = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const { class_id } = req.body;
         const idParsed = validateId(id);

         if (!class_id) {
            throw new BadRequestException(['Es requerido seleccionar una clase']);
         }
         if (typeof parseInt(class_id) != 'number') {
            throw new BadRequestException(['El id de la clase debe ser un número']);
         }

         const classDelete = await this.localRepository.deleteClases(idParsed, parseInt(class_id));

         return res.status(200).json({
            message: 'Clase eliminada exitosamente',
            data: classDelete
         });
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
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
            })
         }
      }
   };

   isActivate = async (req: Request, res: Response) => {
      try {
         const { id } = req.params
         const idParsed = validateId(id)
         const localIsActivate = await this.localRepository.isActivate(idParsed);

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
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         }
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
            })
         }
      }
   };

   delete = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const idParsed = validateId(id);
         const localDelete = await this.localRepository.delete(idParsed);

         // Eliminara las imagenes de cloudinary
         if (localDelete.images) {
            for (const item of localDelete.images) {
               await this.handlerImage.deleteImage(item.image)
            }
         }

         return res.status(200).json({
            message: 'Local eliminado exitosamente',
            data: localDelete
         })
      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         }
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
            })
         }
      }
   }
}