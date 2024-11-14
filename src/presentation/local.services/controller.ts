import { Request, Response } from 'express';
import { HandleImage, ILocalServiceRepository } from '../../interfaces';
import { BadRequestException, NotFoundException, UnauthorizedException, validateId } from '../../utils';
import { LocalServiceDTO } from './DTO';

export class LocalServicesController {
   constructor(
      private readonly localServiceRepository: ILocalServiceRepository,
      private readonly handlerImage: HandleImage,
      private readonly nameFolder: string,
   ) { }

   getAll = async (_req: Request, res: Response) => {
      try {
         const locals = await this.localServiceRepository.getAll();
         return res.status(200).json({
            message: 'Listado de Servicios exitosamente',
            data: locals
         })

      } catch (error) {
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
            })
         };
      }
   };

   create = async (req: Request, res: Response) => {
      try {
         const body = req.body;
         const icon = req.file as Express.Multer.File;

         const createDTO = LocalServiceDTO.create(body);

         if (icon) {
            // Subir el icon a cloudinary
            const iconUrl = await this.handlerImage.uploadImage(icon, this.nameFolder);
            createDTO.icon = iconUrl;
         }

         const newService = await this.localServiceRepository.create(createDTO);

         return res.status(201).json({
            message: 'Servicio creado exitosamente',
            data: newService
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado',
            })
         }
      };
   }
   update = async (req: Request, res: Response) => {
      try {
         const { id } = req.params;
         const body = req.body;
         const icon = req.file as Express.Multer.File;

         const IdParse = validateId(id);

         const updateDTO = LocalServiceDTO.update(body);

         // Subir el icon a cloudinary en el caso de recibir una icono
         if (icon) {
            const iconUrl = await this.handlerImage.uploadImage(icon, this.nameFolder);
            updateDTO.icon = iconUrl;
         }

         const { update, dataPast } = await this.localServiceRepository.update(IdParse, updateDTO);

         // Eliminar el icono de cloudinary en el caso de recibir un nuevo icono
         if (dataPast.icon && typeof updateDTO.icon == 'string') {
            const resultDestroyImage = await this.handlerImage.deleteImage(dataPast.icon);

            if (!resultDestroyImage) {
               return res.status(200).json({
                  message: 'Servicio actualizado exitosamente. El icono no se logro eliminar',
                  data: update
               })
            }
         };

         return res.status(200).json({
            message: 'Servicio actualizado exitosamente',
            data: update
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         };

         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         };

         if (error instanceof NotFoundException) {
            return res.status(404).json({
               messge: error.message,
            })
         }

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
         const { is_delete_definitive: definitive } = req.body;

         const IdParse = validateId(id);

         if (typeof definitive !== 'boolean') {
            throw new BadRequestException(['is_delete_definitive es requerido']);
         }

         if (typeof Boolean(definitive) !== 'boolean') {
            throw new BadRequestException(['is_delete_definitive debe ser un booleano']);
         }

         const deleteData = await this.localServiceRepository.delete(IdParse, definitive);

         // Eliminar el icono de cloudinary 
         if (deleteData.icon) {
            const imageDestroy = await this.handlerImage.deleteImage(deleteData.icon);

            if (!imageDestroy) {
               return res.status(200).json({
                  message: 'Servicio eliminado exitosamente, El icono no se logro eliminar',
                  data: true,
               })
            }
         };

         return res.status(200).json({
            message: 'Servicio eliminado exitosamente',
            data: true,
         });

      } catch (error) {
         if (error instanceof BadRequestException) {
            return res.status(400).json({
               messages: error.messages,
            })
         };
         if (error instanceof UnauthorizedException) {
            return res.status(401).json({
               message: error.message,
            })
         }
         if (error instanceof NotFoundException) {
            return res.status(404).json({
               messge: error.message,
            })
         }
         if (error instanceof Error) {
            return res.status(500).json({
               message: 'Error inesperado'
            });
         }
      }
   }
}